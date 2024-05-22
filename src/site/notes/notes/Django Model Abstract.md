---
{"dg-publish":true,"permalink":"/notes/django-model-abstract/","tags":["#Python/Django/model"]}
---

# Django Model Abstract

- 일반적인 클래스 상속과 유사한 방식으로 동작하는 모델 상속 방식
- 부모 모델의 `Meta`클래스에 `abstract=True`를 선언함으로써 사용할 수 있고, 이를 상속받은 자식클래스들은 부모 클래스의 필드나 메서드 등을 공통으로 가짐
