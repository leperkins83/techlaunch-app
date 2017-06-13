create database fvi_quiz_app;
use fvi_quiz_app;
create table medical_questions (id int auto_increment key not null, question varchar(1024) not null);
create table medical_question_answers (id int auto_increment key not null, question_id int not null, answer_text varchar(256) not null, correct boolean not null);
alter table medical_questions_answers add foreign key (question_id0 references medical_questions(id);
