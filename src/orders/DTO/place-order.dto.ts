import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceOrderDto {
    @ApiProperty({
        description: 'ID of the order to be placed',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({
        description: 'Payment method ID',
        example: 'card_123456',
        required: true
    })
    @IsNotEmpty()
    paymentMethodId: string;
}