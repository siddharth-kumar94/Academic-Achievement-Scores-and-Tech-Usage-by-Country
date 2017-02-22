
<h1> Academic Achievement Scores & Tech Use by Country </h1>
<h4> Siddharth Kumar </h4>

View visualization here:
http://bl.ocks.org/siddharth-kumar94/raw/97089c0328eea3ffa8bfe949a42854f7/

<h2> Summary </h2>

This user-driven visualization compares academic achievement and technology usage by country, and allows the user to intuit a relationship between these metrics. The countries are colored according to a red-yellow-green scale, with red indicating a low PISA score, and green indicating a high score. Hovering over a country reveals the average grade students received in a particular subject, its rank out of 39 countries, and the rates at which technology is used at school and home. It's evident that countries with lower scores tend to have lower rates of technology usage, while countries with higher scores have higher rates of technology usage.

<h2> Design </h2>

When I decided to create a visualization that compared academic achievement and technology usage by country, a map was the clear choice for visualization type. One of the biggest aesthetic considerations I had to make was how I was going to encode the achievement scores by country. I wanted the user to be able to discern low, average, and high test scores easily. I decided to use color and a red-yellow-green gradient because I've seen this kind of information (low-average-high) encoded this way before and found it to be most clear and insightful. For example, many credit score services report high credit scores in green, average scores in yellow, and low scores in red. An example can be seen here: https://personalnetwork.files.wordpress.com/2011/02/picture-17.png. I made the color scheme clear by including a legend, labeled with 'High', 'Average', and 'Low'.

After receiving feedback, I made the following changes:
<ul>
    <li> Changed the position of the label so that it would not overlap its corresponding country. I accomplished this by placing the label at the maximum x-coordinate for countries on the left side of the map, and minimum x-coordinate for countries on the right side.
    </li>
    <li> Added a stroke color of red for highlighted countries to make it easier to see which country is selected.
    </li>
    <li> Created an "Overall" button to display the average of math, science, and reading scores and set it as the initial setting users see when rendering the page.
    </li>
    <li> Added a note in the header to explain where data came from and how countries were selected. </li>
</ul>

<h2> Feedback </h2>

<b> Person #1 (Udacity Forums)</b>
<ul>
<li><i>"When I hover on a county, the label covers my mouse. I think it is better for the label to deviate some distance from the country I choose."</i></li>
<li><i>"Where are the other countries? You should add an explanation in your chart."</i></li>
</ul>
<br>
<b> Person #2 (Family Member)</b>
<ul>
<li><i> "Add an Overall button, because some people may not care about individual subjects." </i></li>
<li><i> "Include the denominator of the country rank so nobody thinks that it includes all countries."</i></li>
</ul>
<br>
<b> Person #3 (Udacity Reviewer) </b>
<ul>
<li><i> "You need to EXPLAIN your analysis of the data to the reader somewhere on the graphic."</i></li>
<li><i> "There are some logical steps which have comments missing."</i></li>
<li><i> "Have you thought about putting the Javascript and CSS into separate files?"</i></li>

<h2> Resources </h2>

www.bl.ocks.org -- For D3 help
<br>
www.developer.mozilla.org -- For CSS/SVG help
<br>
www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html -- To create gradient legend
<br>
www.stackoverflow.com -- For everything else


```python

```
