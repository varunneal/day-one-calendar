# Day One Calendar for Obsidian

Calendar with scrolling functionality and other rich features, stylized after the [Day One journaling app](https://dayoneapp.com/). 

Built off the classic [Calendar](https://github.com/liamcain/obsidian-calendar-plugin) plugin. 

## Installation

This plugin is not yet an obsidian community plugin. Install manually:

### Bun

Install [Bun](https://bun.sh/docs/installation).

Navigate to your vault's plugin folder, e.g. `vault/.obsidian/plugins`. Then,

```bash

bun create varunneal/day-one-calendar

bun run build

```


## Usage

After installing and enabling this plugin, the calendar view will be on the right side panel. 

If you close it, you can re-open the calendar via the Command Palette ("Open calendar"). 

This plugin is _not_ built to be compatible with any other calendar or journaling plugins. 
I recommend you disable or uninstall any before testing this plugin. 


### Daily Note Name and Location

The name for Daily Notes is specified in the settings for your Daily Note. 
I recommend changing the default values and taking advantage of folders.
For reference, my date format looks like this: `YYYY/MMMM/MMM-D-YYYY`. 


## Customization

You can overwrite anything in `styles.css` in your `obsidian.css` file.

```css
/* day-one-calendar-plugin */

#calendar-container {
    --color-background-day: var(--interactive-normal);
}
```


> **Note:** It's especially important when overriding the classes to prefix them with `#calendar-container` to avoid any unexpected changes within Obsidian!



## To Do

- [ ] Two-column layout for opening the calendar view in a full tab
- [ ] Code cleanup (consistent style sheets, TS compile warnings, etc.)
- [ ] Better dynamic sizing (fonts, px -> rem, etc.)
- [ ] More link-hover and file menu (right click window) support
- [ ] Arrow keys for navigation
- [ ] Consistent UI philosophy for buttons, selecting, hovering. 

