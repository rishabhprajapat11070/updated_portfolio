from django.test import SimpleTestCase
from django.urls import reverse


class UsersApiTests(SimpleTestCase):
    def test_users_returns_json(self):
        response = self.client.get(reverse("api:users"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "name": "Rishabh",
            "message": "Django se data aa gaya!",
        })

    def test_frontend_origin_is_allowed(self):
        response = self.client.get(
            reverse("api:users"), HTTP_ORIGIN="http://localhost:5173"
        )

        self.assertEqual(
            response.headers["Access-Control-Allow-Origin"], "http://localhost:5173"
        )
