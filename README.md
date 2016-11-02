# vefa-pages-loader
Static site page development powered by Webpack

## Special Markdown Attributes

### %% Content Sections %%

Using `%% variable_name %%` on its own line will apply the following general markdown content to a variable of the same name. In the following example, `page.content` would equal the first paragraph, `page.content_alt` would equal the second paragraph, and `page.content_alt_2` would equal the unordered list.

```
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.

%% content_alt %%

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

%% content_alt_2 %%

- Lorem ipsum dolor sit amet, 
- consectetur adipisicing elit, 
- sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
```

The key value must be open with `%%` and closed with `%%` for proper processing. Initial content (such as the first paragraph above) will always be applied to `page.content`. You may override this assignment by starting your markdown with a defined content section key (`%% whatever %%`).