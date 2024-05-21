---
{"dg-publish":true,"permalink":"/notes/python-dunder-method/","tags":["#Python"]}
---

# Python Dunder Method

- 앞뒤로 두 개의 밑줄(undersocre)가 붙은 메서드로 `__init__`, `__del__` 등이 있고, 이를 활용하면 클래스의 기본동작을 커스터마이즈할 수 있음

## dunder method 예시

### `__init__()`

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("Alice", 30)
print(p.name)  # Alice
print(p.age)   # 30
```

- 가장 간단하면서 가장 많이 사용하는 메서드 중 하나로, 객체가 생성될 때 초기화 작업을 함

### `__str__()`

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f"Person(name={self.name}, age={self.age})"

p = Person("Alice", 30)
print(p)  # Person(name=Alice, age=30)
```

- 객체를 출력할 때 어떤 문자열로 표현될지 정의할 수 있음
- 일반적으로 출력하거나, 로그를 남길때 사용할 수 있지만, 개인적인 경험으로는 Django 등 웹프레임워크와 작업할 때, 객체를 간략하게 설명하기 좋기 때문에 사용하는 경우가 많음

## 왜 dunder method를 사용해야 하는가?

- 위에서 설명한 메서드 외에도 많은 메서드가 있지만, 큰 이점이 없다고 생각할 수 있다. 하지만, dunder method를 사용함으로서 코드 가독성 향상, 객체간 커스텀 작동 정의 등의 이점을 가질 수 있다.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def __str__(self):
        return f'{self.name}, {self.age} years old'

person = Person('Alice', 30)
print(person)  # Alice, 30 years old
```

- 예를 들어 dunder method를 사용한 경우, 객체를 출력하기만 해도 원하는 형태로 출력하도록 할 수 있다.

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def display(self):
        return f'{self.name}, {self.age} years old'

person = Person('Alice', 30)
print(person.display())  # Alice, 30 years old
```

- 반면 dunder method를 사용하지 않는다면 객체가 원하는 형태의 문자열을 반환하지 않을 것이고, 원하는 문자열을 얻기 위하여 별도의 메서드 (`display()`)를 작성 및 활용해야 한다.
