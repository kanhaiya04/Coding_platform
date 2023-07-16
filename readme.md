# Coding Platform APIs


[![Generic badge](https://img.shields.io/badge/view-demo-blue?style=for-the-badge)](https://codingplatform-nh6b.onrender.com/)



## To run the server locally

```bash
git clone https://github.com/kanhaiya04/Coding_platform
cd Coding_platform/
```

## Create and configure .env file

```bash
touch .env
cp .env.sample .env
```
update the values in the .env file

## Install packages

**Note:- Use npm package manager to install the packages**

```bash
npm install
```

## To run the server at localhost 5000

```bash
node index
```

# API Doc

**All endpoints:-**

User endpoints
- signUp (admin/participant)
- login
- getUser 

Question endpoints
- createQuestion (admin only)
- createTestCase (admin only)
- submitSolution
- fetchResult
- updateQuestion (admin only)
- deleteQuestion (admin only)
- fetchQuestion

## Examples

1. signUp

**Admin**

![](./img/signUpAdmin.png)

**Participant**

![](./img/signUpParticipant.png)

2. login

![](./img/login.png)

3. getUser

![](./img/getUser.png)

4. createQuestion

![](./img/createQuestion.png)

5. createTestCase

![](./img/createTesrCase.png)

6. submitSolution

![](./img/submitSol.png)

7. fetchResult

![](./img/submissionRes.png)

8. updateProblem

![](./img/updateProblem.png)

9. deleteProblem

![](./img/deleteProblem.png)

10. fetchAllQuestion

![](./img/fetchall.png)

11. fetchDesiredNoQuestion

![](./img/fetchDesiredNo.png)
