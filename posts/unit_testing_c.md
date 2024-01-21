---
title: Writing a simple "test framework" in C. 
publish_date: 2024-02-01
---

## Part one: Inspiration
Recently I have wanted to refresh my data structures and algorithms knowledge.
I have decided to take a free course on FrontendMasters by The Primeagen, however to make it a bit more challenging I decided to do it in C instead of TS. 
While writing the initial implementation of the first algorithm I realized that while in TS I could just use Vitest and go on with the course in C I was unaware of a unit testing library and I did not want to manually write tests in main.c

For the rest of this article I will be using the following simple code as an example:
```c
int linear_search(int* a, int size, int target) {
    for (int i = 0; i < size; i++) {
        if (a[i] == target) {
            return i;
        }
    }
    return -1;
}
```
This will search through an array one by one and return index of an element if it is found, -1 otherwise.

## Part two: How to run all functions from a header? 
Let's walk through the process of creating such library ourselfs.
First We need to find a way to run all functions defined within a header file.
We can archive this with some macro magic.
Let's start with the test runner:
```c
#include <stdio.h>

#define TEST_DEFINITION(N) int N();
// This macro defines a function which is returning an int and hs name N
// Include the tests for the first time to have the functions defined
#include "tests.h"

// This structure holds pointer to out test functions (so We can call them) and their name for printing the results
typedef struct Test {
    int (*func)();
    const char *name;
} Test; 

// We will now change the meaning of a test_definition to be an initialization of a Test struct
#undef TEST_DEFINITION
#define TEST_DEFINITION(N) {N, #N},
// Create array containing all of the functions in our header
const Test tests[] = {
#include "tests.h"
};

int main() {
  printf("Running tests:\n");
  // Iterate over all tests
  int number_of_tests = sizeof(tests) / sizeof(tests[0]); 
  for (int i = 0; i < number_of_tests; i++) {
    int result = tests[i].func();
    printf("\t%s: ", tests[i].name);
    if (result == 1) {
        printf("Passed\n");
    } else {
        printf("Failed\n");
    }
  }
}
```

Now We can create our tests.
First the header:
```c
TEST_DEFINITION(ReturnsErrorOnNotFoundItem)
TEST_DEFINITION(ReturnCorrectIndexForFoundItem)
TEST_DEFINITION(FailingTestCaseForDemoPurpose)
```
Let's preview the preprocessor output using
```bash
clang -E main.c
```
which gives us the following
```c
// I have ommited the expanded stdio.h for brevity
// Here We can see all of our functions defined.
# 1 "./tests.h" 1
int ReturnsErrorOnNotFoundItem();
int ReturnCorrectIndexForFoundItem();
int FailingTestCaseForDemoPurpose();
# 7 "tmp.c" 2


typedef struct Test {
    int (*func)();
    const char *name;
} Test;

// Our array of Test is filled in correctly
const Test tests[] = {
# 1 "./tests.h" 1
{ReturnsErrorOnNotFoundItem, "ReturnsErrorOnNotFoundItem"},
{ReturnCorrectIndexForFoundItem, "ReturnCorrectIndexForFoundItem"},
{FailingTestCaseForDemoPurpose, "FailingTestCaseForDemoPurpose"},
# 20 "tmp.c" 2
};

int main() {
  printf("Running tests:\n");

  int number_of_tests = sizeof(tests) / sizeof(tests[0]);
  for (int i = 0; i < number_of_tests; i++) {
    int result = tests[i].func();
    printf("\t%s: ", tests[i].name);
    if (result == 1) {
        printf("Passed\n");
    } else {
        printf("Failed\n");
    }
  }
}
```
Now We can implement the tests
```c
int ReturnsErrorOnNotFoundItem(){
    int a[] = {0,1,2,3,4,5};
    int r = linear_search(a, 6, 7);
    return r == -1;
};

int ReturnCorrectIndexForFoundItem(){
    int a[] = {0,1,2,3,4,5};
    int r = linear_search(a, 6, 2);
    return r == 2;
}

int FailingTestCaseForDemoPurpose(){
    int a[] = {0,1,2,3,4,5};
    int r = linear_search(a, 6, 3);
    return r == 2;
}
```
Let's compile everything and run with
```bash
clang main.c tests.c -o main && ./main
```
which results in:
```bash
Running tests:
        ReturnsErrorOnNotFoundItem: Passed
        ReturnCorrectIndexForFoundItem: Passed
        FailingTestCaseForDemoPurpose: Failed
```

Great it works!
Now We can get on with our initial project.
Or can We?
## Part three: Automation
What if We want to split our tests into multiple fieles? We would need to go and manually add the import in two places of our main file:

```c
#include <stdio.h>

#define TEST_DEFINITION(N) int N();
#include "tests.h"
// Place number one
#include "our_next_tests.h"

typedef struct Test {
    int (*func)();
    const char *name;
} Test; 

#undef TEST_DEFINITION
#define TEST_DEFINITION(N) {N, #N},
const Test tests[] = {
#include "tests.h"
// Place number two
#include "our_next_tests.h"
};

int main(){
    // This stays the same
}
```
and We would need to do this each time We create a new test file.

It would be great if We could get auto-discovery of our tests. Let's do so using a `Makefile`.
The idea is simple We will use it to generate a single header file containing all of the tests at compile time.
We will keep the `main.c` file unchanged and create an automation which will concatenate all headers which mach this format `name_test.h` into our final `tests.h`.

## Part four: Sugar 
Now that We can easily run all of the tests, let's revisit the runner and "framework" parts and add some much needed pop.

First returing just a simple yes/no is not that helpfull, so We will add a possible error message. Secondly right now We have no information from which file came the failing test.

## Part five: What remains?
The two things which sting the most using this solution are connected to assertions. Right now they only work for things which can be compered via `==` I would like to expand it to also be able to pass a custom comparison function, secondly I would like to introduce more of assertions not only for equality but also for smaller them bigger then etc.

---
Thank You for reading, this is my first article I hope You have enjoyed it. If You did please share it, and if You have any questions or want to discuss it, feel free to reach out at [twitter/x](https://twitter.com/vertin_dev).