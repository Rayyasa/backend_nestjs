import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export function IsValidCarModel(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCarModel',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const merek = args.object['merek'];
          console.log('Nilai merek:', merek);
          if (!merek || !value) {
            return false;
          }

          const normalizedValue = value.toLowerCase();
          const normalizedMerk = merek.toLowerCase();
          // Validasi tipe mobil berdasarkan merek
          if (normalizedMerk === 'honda') {
            return ['crv', 'brv', 'hrv'].includes(normalizedValue);
          } else if (normalizedMerk === 'toyota') {
            return ['avanza', 'innova', 'raize'].includes(normalizedValue);
          } else if (normalizedMerk === 'suzuki') {
            return ['ertiga', 'xl7', 'baleno'].includes(normalizedValue);
          }

          return false;
        },
      },
    });
  };
}
