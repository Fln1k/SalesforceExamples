@isTest
private class WeatherControllerTest{
	@isTest
	static void getForecast(){
		String daysAmount = '1';
		String cityName = 'Minsk';
		Test.startTest();
		Test.setMock(HttpCalloutMock.class, new WeatherHttpCalloutMock());
		WeatherForecast forecast = WeatherController.getForecast(daysAmount, cityName);
		Test.stopTest();

		System.assertEquals('2021-01-22', forecast.forecast.forecastday[0].forecastDate, 'wrong date');
        System.assertEquals(0.9, forecast.forecast.forecastday[0].day.maxtemp_c, 'wrong max temperature');
        System.assertEquals(-6.1, forecast.forecast.forecastday[0].day.mintemp_c, 'wrong min temperature');
        System.assertEquals(-1.3, forecast.forecast.forecastday[0].day.avgtemp_c, 'wrong avg temperature');
	}
}