/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose';

type SwaggerSchema = {
  type: string;
  description?: string;
  items?: unknown;
  enum?: string[];
  default?: any;
  properties?: Record<string, any>;
  required?: string[];
};

class SchemaConverter {
  private mapMongooseTypeToOpenAPI(type: any): string {
    switch (type) {
      case String:
        return 'string';
      case Number:
        return 'number';
      case Boolean:
        return 'boolean';
      case Date:
        return 'string'; // Date is represented as string in OpenAPI
      case Array:
        return 'array';
      case Object:
        return 'object';
      default:
        return 'string';
    }
  }

  public convert(mongooseSchema: Schema): SwaggerSchema {
    const swaggerSchema: SwaggerSchema = {
      type: 'object',
      properties: {},
      required: [],
    };

    const schemaPaths = mongooseSchema.paths;

    Object.keys(schemaPaths).forEach(key => {
      const path = schemaPaths[key];
      const fieldOptions = path.options;

      const fieldSchema: SwaggerSchema = {
        type: this.mapMongooseTypeToOpenAPI(fieldOptions.type),
      };

      // Add additional field options like enum, default, etc.
      if (fieldOptions.enum) {
        fieldSchema.enum = fieldOptions.enum;
      }

      if (fieldOptions.default !== undefined) {
        fieldSchema.default = fieldOptions.default;
      }

      if (fieldOptions.required) {
        swaggerSchema.required?.push(key);
      }

      // Handle arrays
      if (fieldOptions.type instanceof Array && fieldOptions.type.length > 0) {
        fieldSchema.type = 'array';
        fieldSchema.items = {
          type: this.mapMongooseTypeToOpenAPI(fieldOptions.type[0]),
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      swaggerSchema.properties![key] = fieldSchema;
    });

    return swaggerSchema;
  }
}

const schemaConverter = new SchemaConverter();
export default schemaConverter;
export { SchemaConverter, SwaggerSchema };
