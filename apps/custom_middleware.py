def csrf_middleware(get_Response):
  def middleware(request):
    response = get_Response(request)
    response.data['csrf_token'] = response.session
    import pdb ; pdb.set_trace()
    return response
  return middleware