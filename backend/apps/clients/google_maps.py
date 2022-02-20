import googlemaps
import os

class GoogleMapsClient:
  def __init__(self) -> None:
    self.client = googlemaps.Client(os.environ.get("GOOGLE_API_KEY"))
  
  def autocomplete(self, query):
    resp = self.client.places_autocomplete_query(query)
    return map(lambda place: {
      "main_text": place["structured_formatting"]["main_text"],
      "secondary_text": place["structured_formatting"]["secondary_text"],
      "place_id": place["place_id"]
    }, resp)