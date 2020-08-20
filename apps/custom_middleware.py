import logging
from django.conf import settings

if settigs.DEBUG == True:
    logger = logging.getLogger('debug')
else:
    logger = logging.getLogger('onlease')
    
class LogErrorMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    response = self.get_response(request)
    if ressponse.status_code > = 400:
        logger.error(response.content)
    return response
