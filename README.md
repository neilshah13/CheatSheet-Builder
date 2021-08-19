# Cheat Sheet Builder

## Second Runner Up at iNTUition V7.0 - Open Category

### Checkout our [Devpost!](https://devpost.com/software/cheatsheet-builder-t0iwer)

<img src="https://user-images.githubusercontent.com/50938891/130049919-27b2fecb-7a93-4e45-a8ea-02f790f54e0e.png" width=500/>

<img src="https://user-images.githubusercontent.com/50938891/130049998-1d02d78e-49bf-4df9-b420-cc612b8f19b7.png" width=500/>


Tired of spending hours formatting Word docs to make it perfect just to have a simple resize change all the output? Our app takes in your images and outputs a perfect pdf using ML and Binning Algos!

## Inspiration
We were tired of often spending more time merging together multiple screenshots of lecture slides into the ultimate cheatsheet than spending time actually studying. Putting to them into MS Word and formatting would inevitably lead to:

![The Microsoft meme](https://i.kym-cdn.com/photos/images/facebook/001/593/905/5b0.png)

We decided to use **CNN** to obtain the font size of texts on screenshots and a **2D bin packing algorithm** -- [2 Phase Bin Packing Hybrid First Fit Algorithm](https://cgi.csc.liv.ac.uk/~epa/surveyhtml.html) .
## What it does
* The user inputs a series of images
* As we need to make sure that each optimally resized image is still readable to the user, we run a text detection algorithm making use of CNN in order to output bounding boxes around each word. We use this as a proxy for font size of images. We output a score for the size of words on each image
* We resize images according to the scoring to make sure that all images ar approximately the same font size and are readable to the user
* We merge all images into a pdf using a two phase binning algorithm in order to output images in the most space efficient manner

## How we built it
Code, tears and guttural screams

We run the text detection and resizing in Python on a Flask Server using OpenCV.
We have a React- Native front end and a Node.js backend.
The user inputs the images which then triggers the text detection algorithm to run in python.
We then run the binning algorithm in Node to pack all the images together.

We emphasised a clean and functional UI, that is both easy to use and appealing to the user-- and so we adopted a UI style called _neumorphism_.

