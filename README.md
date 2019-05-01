# Airport Map of U.S. with Coordinate Reference System

For this project, a chloropeth map of the United States is displayed based on how many airports are located within each state. The locations of airports in each state are also displayed. Upon clicking on each location, the name of that airport is then displayed in a popup message. Each airport location is marked by a paper airplane icon.

For color choices, the chloropeth map of states was set from yellow for states with few airports and dark red for states with multiple airports. Purple was assigned to airports that had a control tower while dark green was assigned to airports that did not have a control tower. I set multiple zoom intervals for the graticule. Specifically, the interval is 2 degrees for zoom level 1, 1 degree for zoom levels 2 and 3, 0.5 degrees for levels 4 and 5, and 0.25 for levels 6 and 7. Green was applied to the graticule lines while purple was assgined to the graticule font as to keep consistent with the colors used for the airport locations. 

For the projection, I chose the WGS 1984 Web Mercator projection. The WGS 1984 Web Mercator projection displays all of the earth on a flat surface. Areas near the Equator are the most accurate in terms of shape, but is increasingly distorted the closer the area is to one of the poles. However, this projection is good at displaying location data once it is reprojected (ESRI, 2010). While this projection has no impact on the color that is being displayed for each state, this does maintain accuracy for the location of the airport as opposed to altering their true locations.

## Sources:
* Project based off of Lab 2 of GEOG 4/572 by Bo Zhao of Oregon State University
* ESRI, "Web Mercator", 2010, https://www.esri.com/events/seminars/bettermaps/~/media/files/pdfs/events/seminars/bettermaps/materials/pdfs/webmercatorsmnrbrochure.pdf
* Link to projection used: https://spatialreference.org/ref/sr-org/45/
* Airport Data: Data.gov, https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile
* US States Data: Mike Bostock: https://bost.ocks.org/mike/, D3: https://d3js.org/
* Font Awesome Icon: https://fontawesome.com/icons/paper-plane?style=solid
