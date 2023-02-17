# Frontend Mentor - Todo app solution

This is a solution to the [Todo app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Add new todos to the list
- Mark todos as complete
- Delete todos from the list
- Filter by all/active/complete todos
- Clear all completed todos
- Toggle light and dark mode
- **Bonus**: Drag and drop to reorder items on the list

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- HTML5
- CSS
- Flexbox
- CSS Grid
- JavaScript
- Mobile-first workflow

### What I learned

The use of `box-shadow` for the todo shadow effect was causing issues with layer order and shadow bleeding into other elements. I ended up using `filter: drop-shadow()`, which seems to work well.

Learned a bit about drag-and-drop implementation since I'm not using a third-party library. Would like to add better user experience by improving visual feedback as you're dragging.

If there was a non-invasive, semantic way to add the "No entries" message, I would've considered it. It made things a little more problematic while implementing add/delete todos and the filtering options.

The drag-and-drop and the filtering options were probably the most difficult aspects to implement in this design.

### Continued development

Improve user experience with drag-and-drop implementation.

## Author

- Frontend Mentor - [@seranela](https://www.frontendmentor.io/profile/seranela)