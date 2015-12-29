I developed this Javascript front-end to let users group and/or sort a JSON resultset using as many columns as they want. Most examples of client-side reporting just put the data in a table with clickable headers. That's fine if you just want to sort on one column, but it doesn't let you sort on multiple columns, and worse, it doesn't allow for grouping. Crystal Reports and Microsoft Access work great for designing complex reports, but there are many instances where these products are overkill. Sometimes the user just needs to be able get a resultset back and quickly group it on a couple of columns to get a visual sense of the data.
I included all the 3rd-party libraries like JQuery/Lodash/etc here for simplicity of use. You should be able to put the files on a web server as-is to test it out. The ControlPanel.htm will be the home page.
