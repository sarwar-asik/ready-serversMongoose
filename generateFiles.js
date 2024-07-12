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

export const ${capitalize(folderName)}_model = model<I${capitalize(
        folderName
      )}>('${capitalize(folderName)}',  ${capitalize(folderName)}Schema);
`,
  },
  {
    name: 'service.ts',
    getCode: folderName =>
      `
import { I${capitalize(folderName)} } from './${folderName}.interface';
import { ${capitalize(folderName)}_model } from './${folderName}.model';

const create_${folderName}_db = async (payload: I${capitalize(
        folderName
      )}): Promise<I${capitalize(folderName)}> => {
  const result = await ${capitalize(folderName)}_model.create(payload);
  
  return result;
};

export const ${capitalize(folderName)}Service = { create_${folderName}_db };

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

const create_${folderName} = async (req: Request, res: Response) => {
  const { ...${folderName}Data } = req.body;
  const response = await ${capitalize(
    folderName
  )}Service.create_${folderName}_db(${folderName}Data,);

  if (response) {
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: '${capitalize(folderName)} created successfully',
      data: response,
    });
  }
};

export const ${capitalize(folderName)}Controller = { create_${folderName} };

`,
  },

  {
    name: 'validation.ts',
    getCode: folderName =>
      `
import { z } from 'zod';
const create_${capitalize(folderName)} = z.object({
  body: z.object({
    title: z.number({
      required_error: 'title is Required (zod)',
    }),
    userId: z.string({
      required_error: 'userId is Required (zod)',
    })
  }),
});

export const ${capitalize(folderName)}Validation = { create_${capitalize(
        folderName
      )} };


`,
  },
  {
    name: 'route.ts',
    getCode: folderName =>
      `/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { ${capitalize(
        folderName
      )}Controller } from './${folderName}.controller';
import {${capitalize(folderName)}Validation } from './${folderName}.validation';
const router = Router();
router.get('/')
router.post('/')

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
