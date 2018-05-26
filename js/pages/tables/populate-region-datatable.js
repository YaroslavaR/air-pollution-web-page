function getStationDataByRegion() {
        $("#region_table tr").remove();

        var sel = document.getElementById('region-select');
        console.log(sel.value);

        String.prototype.format = function () {
                var args = [].slice.call(arguments);
                return this.replace(/(\{\d+\})/g, function (a){
                    return args[+(a.substr(1,a.length-2))||0];
                });
        };

        var xhttp = new XMLHttpRequest();
        url = "https://salty-thicket-12425.herokuapp.com/poland-pollution/query";
        data = "query=prefix dc: <http://purl.org/dc/terms/> prefix uni: <http://uniovi.es/> \
                prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>  \
                prefix dcterm: <http://purl.org/dc/terms/>  prefix dsbase: <https://data.cityofnewyork.us/resource/>  \
                prefix skos:  <http://www.w3.org/2004/02/skos/core#>  prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>  \
                prefix dcat:  <http://www.w3.org/ns/dcat#>  prefix socrata: <http://www.socrata.com/rdf/terms#>  \
                prefix foaf:  <http://xmlns.com/foaf/0.1/>  prefix ds:    <https://data.cityofnewyork.us/resource/c3uy-2p5r/>  \
                prefix ods:   <http://open-data-standards.github.com/2012/01/open-data-standards#>  prefix schema:<http://schema.org/>  \
                prefix gios:<http://powietrze.gios.gov.pl/pjp/current/station_details/info/> prefix xsd:    <http://www.w3.org/2001/XMLSchema#> \
                select distinct * where { ?x ?y ?z; schema:addressRegion \"{0}\";\
                gios:active \"true\"^^xsd:boolean.}".format(sel.value);
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(data);

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
                parsed_json = JSON.parse(xhttp.responseText);
                
                // processing data
                var geo_entity_name = {};
                var address_locality = {};
                var street_address = {};
                var latitude = {};
                var longitude = {};
                for (var i = 0; i < parsed_json["results"]["bindings"].length; i++) {
                    var x = parsed_json["results"]["bindings"][i]["x"]["value"];
                    var y = parsed_json["results"]["bindings"][i]["y"]["value"];
                    var z = parsed_json["results"]["bindings"][i]["z"]["value"];
                    if (y == "http://powietrze.gios.gov.pl/pjp/current/station_details/info/geo_entity_name") {
                        geo_entity_name[x] = z;
                    } else if (y == "http://schema.org/adressLocality") {
                        address_locality[x] = z;
                    } else if (y == "http://schema.org/streetAddress") {
                        street_address[x] = z;
                    } else if (y == "http://schema.org/latitude") {
                        latitude[x] = z;
                    } else if (y == "http://schema.org/longitude") {
                        longitude[x] = z;
                    }
                }

                // visualising data
                $('#region_table').find('thead').append("<tr><th>" + "URI" + "</tr></th>");
                $('#region_table').find('tfoot').append("<tr><th>" + "URI" + "</tr></th>");
                $('#region_table').find('thead').find('tr').append("<th>" + "GEO ENTITY NAME" + "</th>");
                $('#region_table').find('tfoot').find('tr').append("<th>" + "GEO ENTITY NAME" + "</th>");
                $('#region_table').find('thead').find('tr').append("<th>" + "CITY" + "</th>");
                $('#region_table').find('tfoot').find('tr').append("<th>" + "CITY" + "</th>");
                $('#region_table').find('thead').find('tr').append("<th>" + "STREET" + "</th>");
                $('#region_table').find('tfoot').find('tr').append("<th>" + "STREET" + "</th>");

                var tr = [];
                for(var key in geo_entity_name){
                    tr = $('<tr/>');
                    var key_id = key.split("/");
                    key_id = key_id[key_id.length - 1];

                    tr.append("<td>" + "<a href=\"" + key + "\">" + key + "</a></td>");
                    tr.append("<td>" + geo_entity_name[key] + "</td>");
                    tr.append("<td>" + address_locality[key] + "</td>");
                    tr.append("<td>" + street_address[key] + "</td>");
                    metadata = $("<metadata itemscope itemtype=\"http://powietrze.gios.gov.pl/pjp/current/station_details/info/\" id=\"{0}\"/>".format(key_id));
                    tr.append(metadata);

                    var metadata_items = "<meta itemprop=\"name\" content=\"{0}\"/>".format(geo_entity_name[key]) + 
                                "<meta itemprop=\"http://schema.org/addressLocality\" content=\"{0}\"/>".format(address_locality[key]) + 
                                "<meta itemprop=\"http://schema.org/streetAddress\" content=\"{0}\"/>".format(street_address[key]) + 
                                "<meta itemprop=\"http://schema.org/latitude\" content=\"{0}\"/>".format(latitude[key]) + 
                                "<meta itemprop=\"http://schema.org/longitude\" content=\"{0}\"/>".format(longitude[key]);
                    metadata.append(metadata_items);

                    $('#region_table').append(tr);
                }

            $('#region_table').dataTable();
        }
    }
}


function getStationDataByDistrict() {
        $("#region_table tr").remove();

        var sel = document.getElementById('region-select');
        console.log(sel.value);

        String.prototype.format = function () {
                var args = [].slice.call(arguments);
                return this.replace(/(\{\d+\})/g, function (a){
                    return args[+(a.substr(1,a.length-2))||0];
                });
        };
    
        var xhttp = new XMLHttpRequest();
        url = "http://localhost:3030/new_york_pollution/query";
        data = "query=prefix dc: <http://purl.org/dc/terms/> prefix uni: <http://uniovi.es/> \
                prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>  \
                prefix dcterm: <http://purl.org/dc/terms/>  prefix dsbase: <https://data.cityofnewyork.us/resource/>  \
                prefix skos:  <http://www.w3.org/2004/02/skos/core#>  prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>  \
                prefix dcat:  <http://www.w3.org/ns/dcat#>  prefix socrata: <http://www.socrata.com/rdf/terms#>  \
                prefix foaf:  <http://xmlns.com/foaf/0.1/>  prefix ds:    <https://data.cityofnewyork.us/resource/c3uy-2p5r/>  \
                prefix ods:   <http://open-data-standards.github.com/2012/01/open-data-standards#>  prefix schema:<http://schema.org/>  \
                prefix gios:<http://powietrze.gios.gov.pl/pjp/current/station_details/info/> prefix xsd:    <http://www.w3.org/2001/XMLSchema#> \
                select distinct * where { ?station_id ds:geo_entity_name ?district; ds:geo_type_name ?type. \
                FILTER regex(?district, \"{0}\", \"i\").}".format(sel.value);
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(data);

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
                parsed_json = JSON.parse(xhttp.responseText);
                
                // processing data
                var geo_entity_name = {};
                var measurement_span = {};
                for (var i = 0; i < parsed_json["results"]["bindings"].length; i++) {
                    var station_id = parsed_json["results"]["bindings"][i]["station_id"]["value"];
                    var y = parsed_json["results"]["bindings"][i]["district"]["value"];
                    var z = parsed_json["results"]["bindings"][i]["type"]["value"];
                    geo_entity_name[station_id] = y;
                    measurement_span[station_id] = z;
                }

                // visualising data
                $('#region_table').find('thead').append("<tr><th>" + "URI" + "</tr></th>");
                $('#region_table').find('tfoot').append("<tr><th>" + "URI" + "</tr></th>");
                $('#region_table').find('thead').find('tr').append("<th>" + "GEO ENTITY NAME" + "</th>");
                $('#region_table').find('tfoot').find('tr').append("<th>" + "GEO ENTITY NAME" + "</th>");
                $('#region_table').find('thead').find('tr').append("<th>" + "MEASUREMENT SPAN" + "</th>");
                $('#region_table').find('tfoot').find('tr').append("<th>" + "MEASUREMENT SPAN" + "</th>");

                var tr = [];
                for(var key in geo_entity_name){
                    tr = $('<tr/>');
                    var key_id = key.split("/");
                    key_id = key_id[key_id.length - 1];
                    tr.append("<td>" + "<a href=\"" + key + "\">" + key + "</a></td>");
                    tr.append("<td>" + geo_entity_name[key] + "</td>");
                    tr.append("<td>" + measurement_span[key] + "</td>");

                    metadata = $("<metadata itemscope itemtype=\"https://data.cityofnewyork.us/resource/c3uy-2p5r/\" id=\"{0}\"/>".format(key_id));
                    tr.append(metadata);

                    metadata.append("<meta itemprop=\"name\" content=\"{0}\"/>".format(geo_entity_name[key]));

                    $('#region_table').append(tr);
                }

            $('#region_table').dataTable();
        }
    }
}
