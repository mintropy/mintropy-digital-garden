---
{"dg-publish":true,"permalink":"/notes/drf-serializer/"}
---

# DRF Serializer

```python
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ["id", "username"]

class AdminUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ["id", "username", "name"]
```

- 하나의 모델을 여러 경로로 활용할 때, Serializer를 각 필요에 맞게 조정할 필요가 있다. 그런데 위와 같이 거의 같은 serializer를 여러차례 지정하는것은 비효율적이다.

## Serializer 상속

```python
# 1
class AdminUserSerializer(UserSerializer):
	class Meta:
		model = User
		fields = ["id", "username", "name"]

# 2
class AdminUserSerializer(UserSerializer):
	class UserSerializer.Meta:
		model = User
		fields = ["id", "username", "name"]

# 3
class AdminUserSerializer(UserSerializer):
	class UserSerializer.Meta:
		fields = ["id", "username", "name"]

# 3
class AdminUserSerializer(UserSerializer):
	class UserSerializer.Meta:
		UserSerializer.Meta.fields += ["name"]
```

- 이러한 문제 중 일부는 상속으로 해결할 수 있다
- 가장 기본이 되는 `UserSerializer`를 기반으로 상속을 진행한다
	- 우선 상위의 Serializer 클래스를 상속한다. 여기서는 필드를 따로 지정하지 않았지만, 따로 지정한 필드가 있는 경우 더 유용할 수 있다.
	- 다음으로, Meta 클래스도 상속 할 수 있다.
	- Meta 클래스를 상속하면, Meta 클래스에서 지정하는 모델 항목을 생략할 수 있다.
	- 마지막으로 fields 항목 역시 상속을 활용하여 마무리 한다.

## Serializer Field 동적으로 활용

```python
class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ["id", "username"]

	def __init__(self, *args, **kwargs):
		fields = kwargs.pop("fields")
		super.__init__(*args, **kwargs)
		if fields is not None:
			for field in fields:
				self.fields.pop(field)
```

- 도 다른 방법은, 하나의 Serializer를 활용하는 방법으로, `__init__`함수를 활용하여 사용할 필드를 동적으로 지정할 수 있다.