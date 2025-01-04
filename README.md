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

I can't guarantee every accent color/light mode will look great.

You can overwrite anything in `styles.css` in your `obsidian.css` file. Below are some defaults you may want to overwrite:

```css
/* day-one-calendar-plugin */

#calendar-container {
    --color-background-day: var(--interactive-normal);
    --color-background-day-hover: var(--interactive-normal-hover);

    --color-text-day: var(--text-normal);
    --color-text-day-hover: var(--text-normal);

    --color-background-day-note: var(--accent);
    --color-background-day-note-hover: var(--accent-light);

    --color-text-has-note: var(--text-on-accent);
    --color-text-has-note-hover: var(--text-on-accent);

    --color-today-dot: var(--color-base-100);

    --color-border-day-active: var(--color-orange);
    --color-border-day-hover: rgba(var(--color-orange-rgb), 0.8);
}
```

[Obsidian CSS color vars](https://docs.obsidian.md/Reference/CSS+variables/Foundations/Colors#Extended+colors) for reference.

> **Note:** Prefix vars/classes with `#calendar-container` to avoid any unexpected changes within Obsidian!


## To Do

- [] Tests
- [ ] Two-column layout for opening the calendar view in a full tab
- [ ] Code cleanup (consistent style sheets, TS compile warnings, etc.)
- [ ] Better dynamic sizing (fonts, px -> rem, etc.)
- [ ] More link-hover and file menu (right click window) support
- [ ] Arrow keys for navigation
- [ ] Consistent UI philosophy for buttons, selecting, hovering. 

