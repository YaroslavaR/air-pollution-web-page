$(function () {
    getPolandMorris('MpKrakAlKras', '2015', 'MpKrakAlKras-line_chart');
    getPolandMorris('LdLodzCzerni', '2015', 'LdLodzCzerni-line_chart');
    getPolandMorris('MzWarMarszal', '2016', 'MzWarMarszal-line_chart');
});


function getPolandMorris(type, year, element) {
    String.prototype.format = function () {
            var args = [].slice.call(arguments);
            return this.replace(/(\{\d+\})/g, function (a){
                return args[+(a.substr(1,a.length-2))||0];
            });
    };

    var xhttp_morris = new XMLHttpRequest();
    url = "http://localhost:3030/poland-pollution/query";
    query = "query=prefix dc: <http://purl.org/dc/terms/> prefix uni: <http://uniovi.es/> \
            prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix geo:   <http://www.w3.org/2003/01/geo/wgs84_pos#>  \
            prefix dcterm: <http://purl.org/dc/terms/>  prefix dsbase: <https://data.cityofnewyork.us/resource/>  \
            prefix skos:  <http://www.w3.org/2004/02/skos/core#>  prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>  \
            prefix dcat:  <http://www.w3.org/ns/dcat#>  prefix socrata: <http://www.socrata.com/rdf/terms#>  \
            prefix foaf:  <http://xmlns.com/foaf/0.1/>  prefix ds:    <https://data.cityofnewyork.us/resource/c3uy-2p5r/>  \
            prefix ods:   <http://open-data-standards.github.com/2012/01/open-data-standards#>  \
            prefix schema:<http://schema.org/>  prefix gios:<http://powietrze.gios.gov.pl/pjp/current/station_details/info/>  \
            select distinct * where { ?station_id   schema:mainEntityOfPage ?measure_id; gios:geo_entity_name ?station_name. \
            ?measure_id ds:data_valuemessage ?value; gios:entity_code \"{0}\"; \
            ds:name ?name; ds:measure \"Average Concentration - Month\"; ds:month_description ?month; ds:year_description \"{1}\".}".format(type, year);
    xhttp_morris.open("POST", url, true);
    xhttp_morris.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp_morris.send(query);

    var my_data = [];
    xhttp_morris.onreadystatechange = function () {
        if (xhttp_morris.readyState == XMLHttpRequest.DONE && xhttp_morris.status == 200) {

            parsed_json = JSON.parse(xhttp_morris.responseText);

            // processing data
            
            var pm10 = {};
            var pm2_5 = {};
            for (var i = 0; i < parsed_json["results"]["bindings"].length; i++) {
                var month = parsed_json["results"]["bindings"][i]["month"]["value"];
                var name = parsed_json["results"]["bindings"][i]["name"]["value"];
                var station_name = parsed_json["results"]["bindings"][i]["station_name"]["value"];
                var value = parsed_json["results"]["bindings"][i]["value"]["value"];
                if (name == "PM 10") {
                    pm10[month] = value;
                } else if (name == "PM 2.5") {
                    pm2_5[month] = value;
                }
            }
            for (var key in pm10) {
                var point = {};
                point['period'] = key;
                point['PM 10'] = pm10[key];
                point['PM 2.5'] = pm2_5[key];
                my_data.push(point);
            }


            
            Morris.Line({
                element: element,
                data: my_data,
                xkey: 'period',
                ykeys: ['PM 10', 'PM 2.5'],
                labels: ['PM 10', 'PM 2.5'],
                lineColors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)'],
                lineWidth: 3,
                parseTime: false,
                yCaptionText: 'Month'

            });
        
        }
    }
}
