public with sharing class WeatherController{
	@AuraEnabled(cacheable = true)
	public static WeatherForecast getForecast(String daysCount, String cityName){
		System.debug('daysCount: ' + daysCount);
		System.debug('cityName: ' + cityName);
		HttpRequest req = new HttpRequest();
		String request = 'http://api.weatherapi.com/v1/forecast.json?key=305199b08c3a4e3e9f5134847212101&q=' + cityName + '&days=' + daysCount;
		System.debug('request url = ' + request);
		req.setEndpoint(request);
		req.setMethod('GET');


		Http http = new Http();
		HTTPResponse res = http.send(req);
		String response = res.getBody();
		return WeatherForecast.parse(response);
	}
}