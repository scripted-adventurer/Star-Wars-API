"""This program pulls data from the Star Wars API (http://swapi.dev/) 
and write to stdout a JSON object containing a list of starship
names and for each starship, a list of pilot names who have used that 
starship.
"""

import urllib.request
import urllib.parse
import json
from multiprocessing.dummy import Pool


class Starships:
    """Collect data about all available starships and their pilots and 
    output the formatted JSON to stdout.
    """

    def __init__(self):
        self.api_url = 'https://swapi.dev/api/'
        self.pilot_urls = set()
        self.pilot_info = {}
        self.output_data = {'starships': []}

    def _api_request(self, url):
        """Query the URL specified and return the result as a 
        Python dict.
        """
        request = urllib.request.Request(url)
        response = urllib.request.urlopen(request)
        return json.loads(response.read().decode(response.info().get_param(
            'charset') or 'utf-8'))

    def _get_starships(self):
        """Download all starship names and associated pilot URLs from 
        the /starships endpoint. 
        """
        next_url = self.api_url + 'starships/'
        while next_url:
            starships_data = self._api_request(next_url)
            for starship in starships_data['results']:
                self.output_data['starships'].append({'name': starship['name'], 
                    'pilots': starship['pilots']})
                for pilot in starship['pilots']:
                    self.pilot_urls.add(pilot)
            next_url = starships_data['next']   

    def _get_pilot_name(self, pilot_url):
        """Find a single pilot's name from the URL.  
        """
        pilot_data = self._api_request(pilot_url)
        self.pilot_info[pilot_url] = pilot_data['name']

    def _get_all_pilot_names(self):
        """Find all pilot names based on the URLs, using 
        multithreading. 
        """
        pool = Pool()
        results = pool.map(self._get_pilot_name, self.pilot_urls)
        pool.close()
        pool.join()

    def _update_pilot_info(self):
        """Replace each pilot URL in the output data with its 
        associated name. 
        """
        for starship in self.output_data['starships']:
            for pilot_index in range(len(starship['pilots'])):
                pilot_url = starship['pilots'][pilot_index]
                pilot_name = self.pilot_info[pilot_url]
                starship['pilots'][pilot_index] = pilot_name        

    def main(self):
        """Run all steps and print the formatted JSON output to the 
        console.
        """
        self._get_starships()
        self._get_all_pilot_names()
        self._update_pilot_info()
        print(json.dumps(self.output_data, indent=2))


if __name__ == '__main__':
  Starships().main()