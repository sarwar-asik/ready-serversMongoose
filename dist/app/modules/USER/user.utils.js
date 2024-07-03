"use strict";
// /* eslint-disable no-console */
// import { IAcademicSemester } from '../academicSemister/academicSemister.interace';
// import { User } from './user.model';
// export const findLastStudentId = async (): Promise<string | undefined> => {
//   const lastStudent = await User.findOne({
//     role:"student"
//   }, { id: 1, _id: 0 })
//     .sort({ createdAt: -1 })
//     .lean();
//   return lastStudent?.id ? lastStudent?.id.substring(4) : undefined
// };
// export const generateStudentId = async (
//   academicSemester: IAcademicSemester
// ): Promise<string> => {
//   const currentId =
//     (await findLastStudentId()) || (0).toString().padStart(5, '0');
//   let incrementId = (parseInt(currentId) + 1).toString().padStart(5, '0');
//   console.log('user academic-semester==', academicSemester);
//   incrementId = `${academicSemester.year.substring(2)}${
//     academicSemester.code
//   }${incrementId}`;
//   console.log('incrementid', incrementId, 'currentId', currentId);
//   return incrementId;
//   // lastUserId ++
//   // return String(lastUserId).padStart(5,"0")
// };
// // const lastStudent = await User.findOne({}, { id: 1, _id: 0 })
// // .sort({ createdAt: -1 })
// // .lean();
// // return lastStudent?.id;
// export const findLastFacultyId = async (): Promise<string | undefined> => {
//   const lastFaculty = await User.findOne({
//     role:"student"
//   }, { id: 1, _id: 0 })
//     .sort({
//       createdAt: -1,
//     })
//     .lean();
//   return lastFaculty?.id ?lastFaculty.id.substring(2):undefined
// };
// export const generateFacultyId = async (): Promise<string> => {
//   const currentId =
//     (await findLastFacultyId()) || (0).toString().padStart(5, '0');
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
//   incrementedId = `F-${incrementedId}`;
//   console.log('currentId', currentId, 'incrementId:', incrementedId);
//   return incrementedId;
// };
