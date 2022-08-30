import React from 'react';



export const Banner01DataSource = {
  wrapper: { className: 'banner0' },
  textWrapper: { className: 'banner0-text-wrapper' },
  title: {
    className: 'banner0-title',
    children: 'https://i.postimg.cc/X7tSdJN6/111.png',
  },
  content: {
    className: 'banner0-content',
    children: 'Next generation electricity trading system',
  },
  button: { className: 'banner0-button', children: 'Log in' },
  button1: { className: 'banner0-button', children: 'Log out' },
  button2: { className: 'banner0-button', children: 'Learn more' },
};
export const Feature70DataSource = {
  wrapper: { className: 'home-page-wrapper feature7-wrapper' },
  page: { className: 'home-page feature7' },
  OverPack: { playScale: 0.3 },
  titleWrapper: {
    className: 'feature7-title-wrapper',
    children: [
      {
        name: 'title',
        className: 'feature7-title-h1',
        children: 'Electron Ecosystem Application',
      },
      {
        name: 'content',
        className: 'feature7-title-content',
        children: 'Run your entire trading with 3 integrated applications with Electron',
      },
    ],
  },
  blockWrapper: {
    className: 'feature7-block-wrapper',
    gutter: 24,
    children: [
      {
        md: 6,
        xs: 24,
        name: 'block1',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://img.icons8.com/external-hidoc-kerismaker/344/external-Electron-bioengineering-hidoc-kerismaker.png',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: 'Market',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: 'Buy Electron just one click, get electricity by electron ',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block2',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://img.icons8.com/ios-glyphs/344/power-plant.png',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: 'Power Plant',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: 'Sell your electricity, a platform help you to build your own power plant',
            },
          ],
        },
      },
      {
        md: 6,
        xs: 24,
        name: 'block4',
        className: 'feature7-block',
        children: {
          className: 'feature7-block-group',
          children: [
            {
              name: 'image',
              className: 'feature7-block-image',
              children:
                'https://img.icons8.com/fluency/344/investment.png',
            },
            {
              name: 'title',
              className: 'feature7-block-title',
              children: 'Investment',
            },
            {
              name: 'content',
              className: 'feature7-block-content',
              children: 'Stake your crypto and earn interest, invest for the future'
            },
          ],
        },
      },
    ],
  },
};
export const Footer10DataSource = {
  wrapper: { className: 'home-page-wrapper footer1-wrapper' },
  OverPack: { className: 'footer1', playScale: 0.2 },
  block: {
    className: 'home-page',
    gutter: 0,
    children: [
      {
        name: 'block0',
        xs: 24,
        md: 6,
        className: 'block',
        title: {
          className: 'logo',
          children:
            'https://i.postimg.cc/X7tSdJN6/111.png',
        },
        childWrapper: {
          className: 'slogan',
          children: [
            {
              name: 'content0',
              children: 'Next generation electricity platform',
            },
          ],
        },
      },
      {
        name: 'block1',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'Technology' },
        childWrapper: {
          children: [
            { name: 'link0', href: '#', children: 'Whitepaper' },
           
          ],
        },
      },
      {
        name: 'block2',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'Contact' },
        childWrapper: {
          children: [
            { href: '#', name: 'link0', children: 'FAQ' },
          
          ],
        },
      },
      {
        name: 'block3',
        xs: 24,
        md: 6,
        className: 'block',
        title: { children: 'About' },
        childWrapper: {
          children: [
            { href: '#', name: 'link0', children: 'Our teams' },
            
          ],
        },
      },
    ],
  },
  copyrightWrapper: { className: 'copyright-wrapper' },
  copyrightPage: { className: 'home-page' },
  copyright: {
    className: 'copyright',
    children: (
      <span>
        ©2022 by <a >Kin Hong Chao</a> All Rights
        Reserved
      </span>
    ),
  },
};
