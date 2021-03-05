public with sharing class WeatherController{
	@AuraEnabled(cacheable = true)
	public static WeatherForecast getForecast(String daysCount, String cityName){
		HttpRequest req = new HttpRequest();
		String request = 'http://api.weatherapi.com/v1/forecast.json?key=305199b08c3a4e3e9f5134847212101&q=' + cityName + '&days=' + daysCount;
		req.setEndpoint(request);
		req.setMethod('GET');


		Http http = new Http();
		HTTPResponse res = http.send(req);
		String response = res.getBody();
		return WeatherForecast.parse(response);
	}
}