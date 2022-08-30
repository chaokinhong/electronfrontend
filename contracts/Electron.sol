pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IXerra{
    function buyUsdt(uint256) external;
    function buyXerra(uint256) external;
    function getUsdtAmount(uint256) external view returns(uint256);
    function getXerraAmount(uint256) external view returns(uint256);
}



contract Electron is ERC20{
    address private owner;
    address public tokenAddress;
    address public xerraAddress;
    uint256 public tokenRewardBalance;
    uint256 public etrRewardBalance;
    uint256 public tokenTarget;
    uint256 public etrTarget;
    uint256 public totalElectricity;
    address[] public tokenRewardList;
    address[] public etrRewardList;
    mapping(address=>uint256) public tokenRewardRecord;
    mapping(address=>uint256) public etrRewardRecord;
    mapping(address=>uint256) public tokenStakeBalance;
    mapping(address=>uint256) public etrStakeBalance;
    mapping(address=>uint256) public xerraStakeBalance;

    constructor(address token,uint256 _tokenTarget,uint256 _etrTarget,address _xerra) ERC20("Electron Token", "ETR") {
        tokenAddress = token;
        xerraAddress = _xerra;
        owner = msg.sender;
        tokenTarget = _tokenTarget;
        etrTarget = _etrTarget;
    }

    /*---------------------------------------event-------------------------------------------------------------*/
    event TokenBuy(
        address indexed buyer,
        uint256 indexed token2Sold,
        uint256 indexed token1Bought
    );
    event EtrBuy(
        address indexed buyer,
        uint256 indexed token1Sold,
        uint256 indexed token2Bought
    );
    event AddToken(
        address indexed provider,
        uint256 indexed token1Amount
    );

    event AddEtr(
        address indexed provider,
        uint256 indexed token2Amount
    );

    event RemoveToken (
        address indexed provider,
        uint256 indexed token1Amount
    );

     event RemoveEtr (
        address indexed provider,
        uint256 indexed token2Amount
    );

    event ElectricityIn (
        address indexed provider,
        uint256 indexed electricityAmount
    );

    event ElectricityOut (
        address indexed provider,
        uint256 indexed electricityAmount
    );

    event tokenRewardGiveOut (
        address indexed provider,
        uint256 amount
    );

     event etrRewardGiveOut (
        address indexed provider,
        uint256 amount
    );
/********************************notes/***************************************
view tells us that by running the function, no data will be saved/changed.
pure tells us that not only does the function not save any data to the blockchain, but it also doesn't read any data from the blockchain.

public - can be used when contract was deployed, can be used in child contract
external can be used when contract was deployed , can NOT be used in child contract
Functions in interfaces must be declared external.

internal - can NOT be used when contract was deployed , can be used in child contract
private - can NOT be used when contract was deployed, can NOT be used in child contract

/********************************notes/****************************************/



    
    /*----------------------------private function-----------------------------*/
    function getReserve(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }


    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        // 3% fee
        uint256 inputAmountWithFee = inputAmount * 97;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    function getAmountNofee(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256){
        require(inputReserve > 0 && outputReserve > 0, "invalid reserves");
        uint256 k = inputReserve*outputReserve;
        uint256 new_reserve = k/(inputReserve + inputAmount);
        uint256 output_no_fee = outputReserve - new_reserve;
        return output_no_fee;
    }

    function getTokenPercentage(address provider) public view returns (uint256){
        return tokenStakeBalance[provider]*(10**18)/(getReserve(tokenAddress));
    }

    function getEtrPercentage(address provider) public view returns (uint256){
        return etrStakeBalance[provider]*(10**18)/getReserve(address(this));
    }

    function giveOutTokenReward() public view returns (uint256){
        return tokenRewardBalance*tokenRewardRecord[msg.sender]/(10**18);
    }

    function giveOutEtrReward() public view returns (uint256){
        return etrRewardBalance*etrRewardRecord[msg.sender]/(10**18);
    }

    function updateCurrentStakeToken(address provider) public view returns (uint256){
        return tokenRewardRecord[provider]*getReserve(tokenAddress)/(10**18);
    }

    function updateCurrentStakeEtr(address provider) public view returns (uint256){
        return etrRewardRecord[provider]*getReserve(address(this))/(10**18);
    }

    function usdtStakeInXerra(address provider,uint256 amount) public view returns (uint256){
        return tokenRewardRecord[provider]*amount/(10**18);
    }



    /*------------------------liquidity----------------------------*/

    function EtrToTokenSwap(uint256 amount) public returns (uint256){
        require(amount > 0 ,'not greater than 0');
        uint256 tokenReserve = getReserve(tokenAddress);
        uint256 etrReserve = getReserve(address(this));

        uint256 token_out = getAmount(amount,etrReserve,tokenReserve);
        uint256 token_virtual_out = getAmountNofee(amount,etrReserve,tokenReserve);
        uint256 reward = token_virtual_out - token_out;
        tokenRewardBalance += reward;
        IERC20(address(this)).transferFrom(msg.sender,address(this),amount);
        IERC20(tokenAddress).transfer(msg.sender,token_out);
        for (uint i = 0; i < tokenRewardList.length; i++){
            uint256 newStake = updateCurrentStakeToken(tokenRewardList[i]);
            tokenStakeBalance[tokenRewardList[i]] = newStake;
        }
        for(uint i = 0; i < etrRewardList.length; i++){
            uint256 newStake = updateCurrentStakeEtr(etrRewardList[i]);
            etrStakeBalance[etrRewardList[i]] = newStake;
        }
        emit TokenBuy(msg.sender,amount,token_out);
        return token_out;

    }

    function tokenToEtrSwap(uint256 amount) external  {
        require(amount > 0 ,'not greater than 0');
        uint256 tokenReserve = getReserve(tokenAddress);
        uint256 etrReserve = getReserve(address(this));

        uint256 etrOut = getAmount(amount,tokenReserve,etrReserve);
        uint256 etr_virtual_out = getAmountNofee(amount,tokenReserve,etrReserve);
        uint256 reward = etr_virtual_out-etrOut;
        etrRewardBalance += reward;
        IERC20(tokenAddress).transferFrom(msg.sender,address(this),amount);
        IERC20(address(this)).transfer(msg.sender,etrOut);
        for (uint i = 0; i < tokenRewardList.length; i++){
            uint256 newStake = updateCurrentStakeToken(tokenRewardList[i]);
            tokenStakeBalance[tokenRewardList[i]] = newStake;
        }
        for(uint i = 0; i < etrRewardList.length; i++){
            uint256 newStake = updateCurrentStakeEtr(etrRewardList[i]);
            etrStakeBalance[etrRewardList[i]] = newStake;
        }
        emit EtrBuy(msg.sender,amount,etrOut);
    }


    function addTokenLiquidity(uint256 amount) external  {
        require(amount > 0 ,'not greater than 0');
        IERC20(tokenAddress).transferFrom(msg.sender,address(this),amount);
        if(tokenRewardRecord[msg.sender] == 0){
            tokenRewardList.push(address(msg.sender));
        }
        tokenStakeBalance[msg.sender] += amount;
        for (uint i = 0; i < tokenRewardList.length; i++){
            uint256 newPercent = getTokenPercentage(tokenRewardList[i]);
            tokenRewardRecord[tokenRewardList[i]] = newPercent;
        }
        emit AddToken(msg.sender, amount);
    }

    function addEtrLiquidity(uint256 amount) external  {
        require(amount > 0 ,'not greater than 0');
        IERC20(address(this)).transferFrom(msg.sender,address(this),amount);
        if(etrRewardRecord[msg.sender] == 0){
            etrRewardList.push(address(msg.sender));
        }
        etrStakeBalance[msg.sender] += amount;
        for (uint i = 0; i < etrRewardList.length; i++){
            uint256 newPercent = getEtrPercentage(etrRewardList[i]);
            etrRewardRecord[etrRewardList[i]] = newPercent;
        }
        emit AddEtr(msg.sender, amount);
    }

    function handleWithdrawLiquidityInXra() external {
        require(xerraStakeBalance[msg.sender] > 0 ,'not greater than 0');
        IERC20(xerraAddress).approve(address(this),xerraStakeBalance[msg.sender]);
        IERC20(xerraAddress).transferFrom(address(this),msg.sender,xerraStakeBalance[msg.sender]);
        xerraStakeBalance[msg.sender] = 0;
    }


    function withdrawTokenLiquidity(uint256 amount) external {
        require(amount > 0 ,'not greater than 0');
        GiveOutReward(); 
        IERC20(tokenAddress).approve(address(this), amount);
        IERC20(tokenAddress).transferFrom(address(this),msg.sender,amount);
        tokenStakeBalance[msg.sender] -= amount;
        for(uint i = 0; i < tokenRewardList.length; i++){
            uint256 newPercent = getTokenPercentage(tokenRewardList[i]);
            tokenRewardRecord[tokenRewardList[i]] = newPercent;
        }
        emit RemoveToken(msg.sender, amount);
    }

    function withdrawEtrLiquidity(uint256 amount) external {
        require(amount > 0 ,'not greater than 0');
        etrStakeBalance[msg.sender] -= amount;
        for (uint i = 0; i < etrRewardList.length; i++){
            uint256 newPercent = getEtrPercentage(etrRewardList[i]);
            etrRewardRecord[etrRewardList[i]] = newPercent;
        }
        IERC20(address(this)).approve(address(this), amount);
        IERC20(address(this)).transferFrom(address(this),msg.sender,amount);
        emit RemoveEtr(msg.sender, amount);
    }


    function electricityToEtr(uint256 _electricityIn) public  {
        require(_electricityIn > 0 ,'not greater than 0');
        _mint(msg.sender,_electricityIn);
        emit ElectricityIn(msg.sender,_electricityIn);
    }

    function etrToElectricity(uint256 _electricityOut) public  {
        require(_electricityOut > 0 ,'not greater than 0');
        _burn(msg.sender,_electricityOut);
        emit ElectricityOut(msg.sender,_electricityOut);
    }

    function GiveOutReward() private {
        uint256 etrReward = giveOutEtrReward();
        if(etrReward > 0){
            EtrToTokenSwap(etrReward);
            uint256 tokenReward = giveOutTokenReward();
            tokenRewardBalance -= tokenReward;
            etrRewardBalance -= etrReward; 
        } else {
            uint256 tokenReward = giveOutTokenReward();
            tokenRewardBalance -= tokenReward;
        }
    }

    function reduceElectricityPrice(uint256 amount) external {
        require(msg.sender==owner,'not owner');
        require(amount > 0,'not greater than 0');
        IERC20(tokenAddress).approve(address(this),amount);
        IERC20(tokenAddress).transferFrom(address(this),msg.sender,amount);
        for (uint i = 0; i < tokenRewardList.length; i++){
            uint256 newStake = updateCurrentStakeToken(tokenRewardList[i]);
            tokenStakeBalance[tokenRewardList[i]] = newStake;
            uint256 newPercent = getTokenPercentage(tokenRewardList[i]);
            tokenRewardRecord[tokenRewardList[i]] = newPercent;
        }
    }

    function updateLiquidityAfterBalancer(uint256 xerraAmount) external {
        require(xerraAmount > 0 ,'not greater than 0');
         for (uint i = 0; i < tokenRewardList.length; i++){
            xerraStakeBalance[tokenRewardList[i]] += usdtStakeInXerra(tokenRewardList[i],xerraAmount);
        }     
    }




    /*----------------------view---------------------------*/
    function getTokenAmount(uint256 _etrIn) public view returns (uint256){
        require(_etrIn > 0 ,'cannot be zero');
        uint256 tokenReserve = getReserve(tokenAddress);
        uint256 etrReserve = getReserve(address(this));
        return getAmount(_etrIn,etrReserve,tokenReserve);
    }

    function getEtrAmount(uint256 _tokenin) public view returns (uint256){
        require(_tokenin > 0 ,'cannot be zero');
        uint256 tokenReserve = getReserve(tokenAddress);
        uint256 etrReserve = getReserve(address(this));
        return getAmount(_tokenin,tokenReserve,etrReserve);
    }

    function getMyTokenReward() public view returns (uint256){
        uint256 etrReward = giveOutEtrReward();
        if(etrReward > 0){
            uint256 tokenReward = giveOutTokenReward();
            uint256 amountOfEtrToToken = getTokenAmount(etrReward);
            return amountOfEtrToToken+tokenReward;
        }else{
            uint256 tokenReward = giveOutTokenReward();
            return tokenReward;
        }
       
    }

     function getEtrAmountNofee(uint256 _tokenin) public view returns (uint256){
        require(_tokenin > 0 ,'cannot be zero');
        uint256 tokenReserve = getReserve(tokenAddress);
        uint256 etrReserve = getReserve(address(this));
        return getAmountNofee(_tokenin,tokenReserve,etrReserve);

    }

    function getTotalEtrReserve() public view returns(uint256){
        return getReserve(address(this));
    }

    function getTotalEtrSupply() public view returns(uint256){
        return totalSupply();
    }

    function getTotalTokenReserve() public view returns(uint256){
        return getReserve(tokenAddress);
    }



    function getTotalTokenRewardBalance() public view returns(uint256){
        if(etrRewardBalance > 0) {
            uint256 amountOfEtrToToken = getTokenAmount(etrRewardBalance);
            return tokenRewardBalance+amountOfEtrToToken;
        }else{
            return tokenRewardBalance;
        }
       
    }

    function getEtrRewardBalance() public view returns(uint256){
        return etrRewardBalance;
    }



    function getMyTokenStakeBalance() public view returns(uint256){
            return tokenStakeBalance[msg.sender];
    }
    

    function getXerraStakeBalance() public view returns(uint256){
        return xerraStakeBalance[msg.sender];
    }

    function getMyEtrStakeBalance() public view returns(uint256){
        return etrStakeBalance[msg.sender];
    }
}
