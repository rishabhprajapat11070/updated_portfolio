from django.http import JsonResponse

def users(request):
    return JsonResponse({
        "name": "Rishabh",
        "message": "Django se data aa gaya!"
    })