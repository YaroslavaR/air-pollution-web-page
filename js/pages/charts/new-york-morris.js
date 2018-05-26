$(function () {
    getNewYorkMorris('Bronx', '2005', 'Bronx-2005-bar_chart');
    getNewYorkMorris('Bronx', '2013', 'Bronx-2013-bar_chart');
});

function getNewYorkMorris(type, year, element) {
    String.prototype.format = function () {
            var args = [].slice.call(arguments);
            return this.replace(/(\{\d+\})/g, function (a){
                return args[+(a.substr(1,a.length-2))||0];
            });
    };

    var xhttp_morris = new XMLHttpRequest();
    url = "http://localhost:3030/new_york_pollution/query";
    query = "query=prefix dc: <http://purl.org/dc/terms/> prefix uni: <http://uniovi.es/> \
            prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix geo:   <http://www.w3.org/2003/01/geo/wgs84_pos#>  \
            prefix dcterm: <http://purl.org/dc/terms/>  prefix dsbase: <https://data.cityofnewyork.us/resource/>  \
            prefix skos:  <http://www.w3.org/2004/02/skos/core#>  prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>  \
            prefix dcat:  <http://www.w3.org/ns/dcat#>  prefix socrata: <http://www.socrata.com/rdf/terms#>  \
            prefix foaf:  <http://xmlns.com/foaf/0.1/>  prefix ds:    <https://data.cityofnewyork.us/resource/c3uy-2p5r/>  \
            prefix ods:   <http://open-data-standards.github.com/2012/01/open-data-standards#>  \
            prefix schema:<http://schema.org/>  prefix gios:<http://powietrze.gios.gov.pl/pjp/current/station_details/info/>  \
            select distinct * where { ?x ds:geo_entity_name ?y; ds:name ?name; ds:data_valuemessage ?value; \
            ds:year_description \"{0}\". FILTER regex(?y, \"{1}\", \"i\")}".format(year, type);

    xhttp_morris.open("POST", url, true);
    xhttp_morris.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp_morris.send(query);

    var my_data = [];
    var ykeys = [];

    xhttp_morris.onreadystatechange = function () {
        if (xhttp_morris.readyState == XMLHttpRequest.DONE && xhttp_morris.status == 200) {

            parsed_json = JSON.parse(xhttp_morris.responseText);

            // processing data
            
            
            if (year == "2005") {
                var benzene = {};
                var formaldehyde = {};
                for (var i = 0; i < parsed_json["results"]["bindings"].length; i++) {
                    var station_name = parsed_json["results"]["bindings"][i]["y"]["value"];
                    var measure_name = parsed_json["results"]["bindings"][i]["name"]["value"];
                    var measure_value = parsed_json["results"]["bindings"][i]["value"]["value"];
                    if (measure_name == "Air Toxics Concentrations- Average Benzene Concentrations") {
                        benzene[station_name] = measure_value;
                    } else if (measure_name == "Air Toxics Concentrations- Average Formaldehyde Concentrations") {
                        formaldehyde[station_name] = measure_value;
                    }
                }
                for (var key in benzene) {
                    var point = {};
                    point['x'] = key;
                    point['y'] = benzene[key];
                    point['z'] = formaldehyde[key];
                    my_data.push(point);
                }
                ykeys = ['y', 'z'];
                labels = ['Average Benzene Concentrations', 'Average Formaldehyde Concentrations'];
            } else if (year == "2013") {
                var nox = {};
                var pm2_5 = {};
                var so2 = {};
                for (var i = 0; i < parsed_json["results"]["bindings"].length; i++) {
                    var station_name = parsed_json["results"]["bindings"][i]["y"]["value"];
                    var measure_name = parsed_json["results"]["bindings"][i]["name"]["value"];
                    var measure_value = parsed_json["results"]["bindings"][i]["value"]["value"];
                    if (measure_name == "Boiler Emissions- Total NOx Emissions") {
                        nox[station_name] = measure_value;
                    } else if (measure_name == "Boiler Emissions- Total PM2.5 Emissions") {
                        pm2_5[station_name] = measure_value;
                    } else if (measure_name == "Boiler Emissions- Total SO2 Emissions") {
                        so2[station_name] = measure_value;
                    }
                }
                for (var key in nox) {
                    var point = {};
                    point['x'] = key;
                    point['y'] = nox[key];
                    point['z'] = pm2_5[key];
                    point['a'] = so2[key];
                    my_data.push(point);
                }
                ykeys = ['y', 'z', 'a'];
                labels = ['Boiler Emissions- Total NOx Emissions', 'Boiler Emissions- Total PM2.5 Emissions', 'Boiler Emissions- Total SO2 Emissions'];
            }

            Morris.Bar({
            element: element,
            data: my_data,
            xkey: 'x',
            ykeys: ykeys,
            labels: labels,
            barColors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(0, 150, 136)'],
        });
            
        
        }
    }
}
