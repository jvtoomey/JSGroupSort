I developed this Javascript front-end to let users group and/or sort a JSON resultset using as many columns as they want. Most examples of client-side Javascript reporting just put the data in a table with clickable headers. That's fine if you just want to sort on one column, but it doesn't let you sort on multiple columns, and worse, it doesn't allow for grouping. Crystal Reports and Microsoft Access work great for designing complex reports, but there are many instances where these products are overkill. Sometimes the user just needs to be able get a resultset back and quickly group it on a couple of columns to get a visual sense of the data. I included all the 3rd-party libraries like JQuery/Lodash/etc here for simplicity of use. You should be able to put the files on a web server as-is to test it out.

In the example shown here, the *.htm files in the rpt and urpt directories are templates. The file ./rpt/sample1.htm shows the most basic template. At a minimum, you need to provide the SQL query and the fields that will be queried on (ie, everything within the script tags). If you want customized formatting, you can do so after the script tags, as shown in ./urpt/sample2.htm. I use Mustache templates, where the values are substituted where it encounters field names such as {{MODEL}}. The only drawback to using customzed formatting is that the grouping won't be used, since I am adhering to the Mustache template's format provided.

My reporting system needed one directory for standard reports, and another for customized reports, which is why there are the 2 directories rpt and urpt.

The button "Open Excel Pasteable" tab-delimits the data so you can copy/paste it directly to Excel and have it land in separate columns. The grouping and sorting isn't applied to the Excel data since you can perform these functions in Excel; it's just a raw data dump.

After you've run the query, you can leave the Open Report modal open and try different grouping and sorting combinations without having the re-query the server, since it holds on to the data locally. 

Pass the name of the report like this:

http://www.MYDOMAIN.com/JavascriptGroupSortDemo/index.htm?report=sample1.htm
