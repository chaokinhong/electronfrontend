pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Xerra is ERC20 {
    address private owner;
    address public usdtAddress;
    uint256 public target;
    mapping(address=>uint256) public bondRecord;





    constructor(address _usdtAddress,uint256 _target) ERC20('Xerra','XRA'){
        _mint(address(this), 10000000 ether);
        usdtAddress = _usdtAddress; 
        target = _target;
        owner = msg.sender;
    }

    event UsdtBuy(
        address indexed buyer,
        uint256 indexed XerraSold,
        uint256 indexed UsdtBuy
    );

    event XerraBuy(
        address indexed buyer,
        uint256 indexed UsdtSold,
        uint256 indexed XerraBuy
    );

    event AddUsdt(
        address indexed provider,
        uint256 indexed amount
    );

    event RemoveUsdt(
        address indexed provider,
        uint256 indexed amount
    );

    event etrReduce(
        uint256 indexed amount
    );

    event etrIncrease(
        uint256 indexed amount
    );


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


    function calculatePreSale() public view returns(uint256){
        return ((IERC20(address(this)).totalSupply())/target)/2;
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

    function getReserve(address _tokenAddress) public view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    // invest xerra
    function buyXerra(uint256 amount) external {
        require(amount > 0 ,'not greater than 0');
        uint256 usdtReserve = getReserve(usdtAddress);
        uint256 xerraReserve = getReserve(address(this));
        uint256 xerra_out = getAmount(amount,usdtReserve,xerraReserve);
        IERC20(usdtAddress).approve(msg.sender,amount);
        IERC20(address(this)).approve(address(this),xerra_out);
        IERC20(usdtAddress).transferFrom(msg.sender,address(this),amount);
        IERC20(address(this)).transfer(msg.sender,xerra_out);
        emit XerraBuy(msg.sender, amount,xerra_out);
    }


    function preSaleBuyXerra(uint256 amount) external {
        require(amount > 0,'not greater than 0');
        uint256 xerra_out = calculatePreSale()*amount;
        IERC20(usdtAddress).approve(msg.sender,amount);
        IERC20(address(this)).approve(address(this),xerra_out);
        IERC20(usdtAddress).transferFrom(msg.sender,address(this),amount);
        IERC20(address(this)).transfer(msg.sender,xerra_out);
        emit XerraBuy(msg.sender, amount,xerra_out);
    }

    // sell xerra
    function buyUsdt(uint256 amount) external {
        require(amount > 0, "not greater than 0");
        uint256 usdtReserve = getReserve(usdtAddress);
        uint256 xerraReserve = getReserve(address(this));
        uint256 usdt_out = getAmount(amount,xerraReserve,usdtReserve);
        IERC20(address(this)).approve(msg.sender,amount);
        IERC20(usdtAddress).approve(address(this),usdt_out);
        IERC20(address(this)).transferFrom(msg.sender,address(this),amount);
        IERC20(usdtAddress).transfer(msg.sender,usdt_out);
        emit UsdtBuy(msg.sender, amount,usdt_out);
    }

    // usdt bond
    function addUsdtLiquidity(uint256 amount) external {
        require(amount > 0, "not greater than 0");
        bondRecord[msg.sender] +=amount;
        IERC20(usdtAddress).approve(msg.sender,amount);
        IERC20(usdtAddress).transferFrom(msg.sender,address(this),amount);
        _mint(address(this), (amount*getReserve(address(this)))/getReserve(usdtAddress));
        emit AddUsdt(msg.sender,amount);
    }

    // usdt bond cash out
    function withdrawUsdtLiquidity(uint256 amount) external {
        require(amount > 0, "not greater than 0");
        bondRecord[msg.sender] = 0;
        IERC20(usdtAddress).approve(address(this),amount);
        IERC20(usdtAddress).transfer(msg.sender,amount);
        _burn(address(this), (amount*getReserve(address(this)))/getReserve(usdtAddress));
        emit RemoveUsdt(msg.sender,amount);
    }



    // // etr price too high
    // function reduceEtrPrice(uint256 amount,address etrAddress) public {
    //     bool success = IERC20(usdtAddress).approve(address(etrAddress), amount);
    //     if(success) {
    //         uint256 usdtReserve = getReserve(usdtAddress);
    //         uint256 xerraReserve = getReserve(address(this));
    //         uint256 xerra_out = getAmount(amount,usdtReserve,xerraReserve);
    //         IERC20(usdtAddress).approve(address(etrAddress),amount);
    //         IERC20(address(this)).approve(address(this),xerra_out);
    //         IERC20(usdtAddress).transferFrom(address(etrAddress),address(this),amount);
    //         IERC20(address(this)).transfer(address(etrAddress),xerra_out);
    //         emit etrReduce(amount);
    //     }
    // }


    // // etr price too low
    // function increaseEtrPrice(uint256 amount) public {
    //     require(amount > 0, "not greater than 0");
    //     bool success = IERC20(usdtAddress).approve(address(this), amount);
    //     if(success){
    //         uint256 usdtReserve = getReserve(usdtAddress);
    //         uint256 xerraReserve = getReserve(address(this));
    //         uint256 usdt_out = getAmount(amount,xerraReserve,usdtReserve);
    //         IERC20(address(this)).transferFrom(address(etrAddress),address(this),amount);
    //         IERC20(usdtAddress).transfer(address(etrAddress),usdt_out);
    //         emit etrIncrease(amount);
    //     }
    // }



    function getXerraReserve() external view returns(uint256){
        return getReserve(address(this));
    }

    function getUsdtReserve() external view returns(uint256){
        return getReserve(usdtAddress);
    }

    function getUsdtAmount(uint256 xerraIn) external view returns(uint256){
        uint256 usdtReserve = getReserve(usdtAddress);
        uint256 xerraReserve = getReserve(address(this));
        uint256 usdt_out = getAmount(xerraIn,xerraReserve,usdtReserve);
        return usdt_out;
    }

    function getXerraAmount(uint256 usdtIn) external view returns (uint256){
        uint256 usdtReserve = getReserve(usdtAddress);
        uint256 xerraReserve = getReserve(address(this));
        uint256 xerra_out = getAmount(usdtIn,usdtReserve,xerraReserve);
        return xerra_out;
    }

    function getMyUsdtStake() external view returns (uint256){
        return bondRecord[msg.sender];
    }


}