/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const files = [
  {
    name: 'interface.ts',
    getCode: folderName =>
      `
import { Model, ObjectId } from "mongoose";

    export type I${capitalize(folderName)} ={
      name: string;
      userId:ObjectId
    }

export type ${capitalize(folderName)} = Model<I${capitalize(
        folderName
      )},Record<string,unknown>>
`,
  },
  {
    name: 'model.ts',
    getCode: folderName =>
      `
import { Schema } from 'mongoose';
import { I${capitalize(folderName)} } from './${folderName}.interface';
import { model } from 'mongoose';

const ${capitalize(folderName)}Schema: Schema<I${capitalize(
        folderName
      )}> = new Schema<I${capitalize(folderName)}>(
  {
    title: { type: String, required: true },
     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ${capitalize(folderName)}Model = model<I${capitalize(
        folderName
      )}>('${capitalize(folderName)}',  ${capitalize(folderName)}Schema);
`,
  },
  {
    name: 'service.ts',
    getCode: folderName =>
      `
import { I${capitalize(folderName)} } from './${folderName}.interface';
import { ${capitalize(folderName)}Model } from './${folderName}.model';
import { Request } from 'express';
import QueryBuilder from '../../../builder/QueryBuilder';
const create${capitalize(folderName)}Db = async (payload: I${capitalize(
        folderName
      )}): Promise<I${capitalize(folderName)}> => {
  const result = await ${capitalize(folderName)}Model.create(payload);
  
  return result;
};

const all${capitalize(folderName)}Db = async (req: Request) => {
  const query = req.query;
  const ${capitalize(folderName)}Query = new QueryBuilder(
    ${capitalize(folderName)}Model.find({ isActive: true }),
    query
  ).paginate();

  const totalCount = await ${capitalize(folderName)}Query.countTotal();
  const result = await ${capitalize(folderName)}Query.modelQuery;

  return {
    meta: totalCount,
    data: result,
  };
};

export const ${capitalize(folderName)}Service = { create${capitalize(
        folderName
      )}Db, all${capitalize(folderName)}Db };

`,
  },
  {
    name: 'controller.ts',
    getCode: folderName =>
      `
import { Request, Response } from 'express';
import { ${capitalize(folderName)}Service  } from './${folderName}.service';
import sendResponse from '../../../shared/sendResponce';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';

const create${folderName} = catchAsync( async (req: Request, res: Response) => {
  const { ...${folderName}Data } = req.body;
  const response = await ${capitalize(folderName)}Service.create${capitalize(
        folderName
      )}Db(${folderName}Data,);

  if (response) {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: '${capitalize(folderName)} created successfully',
      data: response,
    });
  }
});

const get${capitalize(
        folderName
      )}s = catchAsync(async (req: Request, res: Response) => {
  const result = await ${capitalize(folderName)}Service.all${capitalize(
        folderName
      )}Db(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All ${capitalize(folderName)}s retrieved successfully !',
    data: result.data,
    meta: result.meta,
  });
});

export const ${capitalize(
        folderName
      )}Controller = { create${folderName} ,get${capitalize(folderName)}s};

`,
  },

  {
    name: 'validation.ts',
    getCode: folderName =>
      `
import { z } from 'zod';
const create${capitalize(folderName)} = z.object({
  body: z.object({
    title: z.number({
      required_error: 'title is Required (zod)',
    }),
    userId: z.string({
      required_error: 'userId is Required (zod)',
    })
  }),
});
const update${capitalize(folderName)}Validation = create${capitalize(
        folderName
      )}.deepPartial();
export const ${capitalize(folderName)}Validation = { create${capitalize(
        folderName
      )},update${capitalize(folderName)}Validation };


`,
  },
  {
    name: 'route.ts',
    getCode: folderName =>
      `/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import auth from '../../middlesWare/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ${capitalize(
        folderName
      )}Controller } from './${folderName}.controller';
import {${capitalize(folderName)}Validation } from './${folderName}.validation';


const router = Router();
router.get('/')
router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(${capitalize(folderName)}Validation.create${capitalize(
        folderName
      )}Validation),
  ${capitalize(folderName)}Controller.create${capitalize(folderName)}
);

export const ${capitalize(folderName)}Routes = router;
`,
  },
];

async function createFolderAndFiles(parentDirectory, folderName) {
  try {
    const moduleDirectory = path.join(parentDirectory, folderName);

    // Create the folder
    await fs.mkdir(moduleDirectory);

    // Create the files using for...of loop and async/await
    for (const file of files) {
      const filePath = path.join(moduleDirectory, `${folderName}.${file.name}`);
      await fs.writeFile(filePath, file.getCode(folderName));
      console.log(`Created ${filePath}`);
    }

    console.log('Module and files created successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getUserInput() {
  return new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      'Enter the Module name (or "exit" to terminate): ',
      folderName => {
        readline.close();
        resolve(folderName);
      }
    );
  });
}

async function start() {
  const parentDirectory = 'src/app/modules';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const folderName = await getUserInput();

    if (folderName.toLowerCase() === 'exit') {
      process.exit(0);
    }

    await createFolderAndFiles(parentDirectory, folderName);
  }
}

start();
