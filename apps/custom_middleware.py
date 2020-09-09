import logging
from django.conf import settings

logger = logging.getLogger('testlogger')


class LogErrorMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def process_exception(request, exception):
    logger.error(exception)
    return self.get_response(request)
