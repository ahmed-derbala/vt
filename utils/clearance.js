//application owner
const SUPER = {
  title: 'SUPER',
  level: 790,
  max:10
}

//application administrator
const ADMIN = {
  title: 'ADMIN',
  level: 690,
}

//client support
const SUPPORT = {
  title: 'SUPPORT',
  level: 680,
}

//creator of questions
const CONTENT_CREATOR = {
  title: 'CONTENT_CREATOR',
  level: 680,
}

//company owner
const RECRUITER = {
  title: 'RECRUITER',
  level: 590,
}

const USER = {
  title: 'USER',
  level: 490,
}

const roles = [SUPER.title,ADMIN.title,RECRUITER.title,USER.title]

module.exports = {
  roles,
  SUPER,ADMIN,SUPPORT, CONTENT_CREATOR,RECRUITER, USER
}