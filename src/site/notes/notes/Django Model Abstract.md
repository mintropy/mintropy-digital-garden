---
{"dg-publish":true,"permalink":"/notes/django-model-abstract/","tags":["#Python/Django/model"]}
---

# Django Model Abstract

- 일반적인 클래스 상속과 유사한 방식으로 동작하는 모델 상속 방식
- 부모 모델의 `Meta`클래스에 `abstract=True`를 선언함으로써 사용할 수 있고, 이를 상속받은 자식클래스들은 부모 클래스의 필드나 메서드 등을 공통으로 가짐

```python
from django.db import models

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class BlogPost(BaseModel):
    title = models.CharField(max_length=200)
    content = models.TextField()

class Comment(BaseModel):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    author = models.CharField(max_length=100)
    message = models.TextField()
```

- 위와 같이 선언하여 사용할 수 있다.
	- 부모 클래스가 되는 `BaseModel`에서 필드, 메서드 등을 정의하고, `Meta`클래스를 정의한다.
	- 자식클래스는 일반적인 클래스 상속을 받는 것 처럼 선언하여 사용할 수 있고, 위의 예시에서는 BlogPost와 Comment가 각각 `created_at`, `updated_at` 필드를 포함하고 있다.
- 추상 기반 상속을 사용하면 중복되는 코드를 줄일 수 있는 장점이 있지만, 각 모델마다 어떤 필드가 있는지 파악하는데 시간이 걸릴 수 있는 단점도 가지고 있다.
