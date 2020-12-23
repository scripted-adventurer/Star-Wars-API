"""Test all logic in the starships module. 
"""

import pytest

from starships import Starships 


class TestStarships():
    """Test all functionality in the Starships class.
    """

    def test_api_request(self):
        """Check that correct data is returned for both the starships 
        and people endpoints.
        """
        starships = Starships()
        invalid_endpoint = 'https://swapi.dev/api/invalid'
        with pytest.raises(Exception):
            response = starships._api_request(invalid_endpoint)
        starships_endpoint = 'https://swapi.dev/api/starships'
        response = starships._api_request(starships_endpoint)
        assert response['count'] == 36
        people_endpoint = 'http://swapi.dev/api/people/14/'
        response = starships._api_request(people_endpoint)
        assert response['name'] == 'Han Solo'
        
    def test_get_starships(self):
        """Check that all starship data is downloaded correctly. 
        """
        starships = Starships()
        starships._get_starships()
        assert len(starships.output_data['starships']) == 36
        assert len(starships.pilot_urls) == 19

    def test_get_all_pilot_names(self):
        """Check that all pilot data is downloaded correctly.
        """
        starships = Starships()
        starships.pilot_urls = {'http://swapi.dev/api/people/31/', 
            'http://swapi.dev/api/people/44/', 
            'http://swapi.dev/api/people/79/', 
            'http://swapi.dev/api/people/14/'}
        starships._get_all_pilot_names()
        assert len(starships.pilot_info) == 4

    def test_update_pilot_info(self):
        """Check that all pilot URLs are converted to names correctly. 
        """
        starships = Starships()
        starships.pilot_info = {'http://swapi.dev/api/people/31/': 'Nien Nunb', 
            'http://swapi.dev/api/people/14/': 'Han Solo', 
            'http://swapi.dev/api/people/25/': 'Lando Calrissian',
            'http://swapi.dev/api/people/13/': 'Chewbacca'}
        starships.output_data = {'starships': [
            {'name': 'CR90 corvette', 'pilots': []}, 
            {'name': 'Star Destroyer', 'pilots': []}, 
            {'name': 'Sentinel-class landing craft', 'pilots': []}, 
            {'name': 'Death Star', 'pilots': []}, 
            {'name': 'Millennium Falcon', 'pilots': 
                ['http://swapi.dev/api/people/13/', 
                'http://swapi.dev/api/people/14/', 
                'http://swapi.dev/api/people/25/', 
                'http://swapi.dev/api/people/31/']}]}
        starships._update_pilot_info()
        assert (starships.output_data['starships'][4]['pilots'][0] 
            == 'Chewbacca')

    def test_main(self):
        """Check the whole script runs successfully. 
        """
        starships = Starships()
        starships.main()
        assert len(starships.output_data['starships']) == 36
        assert (starships.output_data['starships'][4]['pilots'][0] 
            == 'Chewbacca')