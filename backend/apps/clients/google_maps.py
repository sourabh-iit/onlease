import googlemaps
import os
import time

DAY_IN_SECONDS = 24*60*60

class GoogleMapsClient:
  def __init__(self) -> None:
    self.client = googlemaps.Client(os.environ.get("GOOGLE_API_KEY"))
    self.cache = {}
  
  def autocomplete(self, query):
    now = time.time()
    if query not in self.cache or now - self.cache[query]['time'] > DAY_IN_SECONDS:
      resp = self.client.places_autocomplete_query(query)
      self.cache[query]['data'] = map(lambda place: {
        "main_text": place["structured_formatting"]["main_text"],
        "secondary_text": place["structured_formatting"]["secondary_text"],
        "place_id": place["place_id"]
      }, resp)
      self.cache[query]['time'] = now
    return self.cache[query]['data']
