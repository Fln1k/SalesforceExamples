@isTest
global class WeatherHttpCalloutMock implements HttpCalloutMock {
    global HTTPResponse respond(HTTPRequest req) {
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"location":{"name":"Minsk","region":"Minsk","country":"Belarus","lat":53.9,"lon":27.57,"tz_id":"Europe/Minsk","localtime_epoch":1611321715,"localtime":"2021-01-22 16:21"},"current":{"temp_c":1.0,"condition":{},"wind_kph":15.1,"feelslike_c":-3.6,"uv":1.0},"forecast":{"forecastday":[{"date":"2021-01-22","day":{"maxtemp_c":0.9,"mintemp_c":-6.1,"avgtemp_c":-1.3,"condition":{}},"astro":{},"hour":[{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}},{"condition":{}}]}]}}');
        res.setStatusCode(200);
        return res;
    }
}