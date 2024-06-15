import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import axios from 'axios';
import { CallbackDto } from './dto/callback.dto';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import * as qs from 'qs';
import { IUser } from 'src/common/interfaces/user.interface';
import { IZALOPAY_ORDER } from 'src/common/interfaces/zalopay.interface';
import { BeforeOrderDto } from './dto/before-order.dto';
import { OrderService } from '../order/order.service';
import { SocketGateWay } from '../socket/socket.gateway';

@Injectable()
export class ZaloPayService {
  constructor(
    private readonly orderService: OrderService,
    private readonly socketService: SocketGateWay,
  ) {}

  async createBeforeOrderQR(user: IUser, dto: BeforeOrderDto) {
    try {
      const embed_data = {
        preferred_payment_method: ['zalopay_wallet'],
        redirecturl: '',
        user: user,
        before_order_dto: dto,
      };

      //const items = dto.cartItems;
      const checkOrder = await this.orderService.checkoutOrder(
        user.id,
        dto.shopCart,
        dto.amount,
      );
      if (!checkOrder)
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Amount not match',
        };
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: process.env.ZALO_APP_ID,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: `${dto.firstName} ${dto.lastName}` ?? user?.name,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(
          checkOrder.newShopCart.map((ele) => ele.cartItems).flat(),
        ),
        embed_data: JSON.stringify(embed_data),
        amount: dto.amount,
        description: `Ecommerce - Payment for the order #${transID}`,
        bank_code: 'zalopayapp',
        callback_url: `${process.env.BACKEND_HOST}/zalopay/callback-payment`,
        mac: '',
        phone: dto.phoneNumber,
        address: dto.address,
        email: user.email,
      };
      const data =
        order.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY1).toString();
      const res = await axios.post(
        `${process.env.ZALO_END_POINT}/create`,
        null,
        {
          params: order,
        },
      );

      if (res?.data?.return_code == 1) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: {
            amount: dto.amount,
            description: res?.data.description,
            codeTransition: order.app_trans_id,
            orderUrl: res?.data.order_url,
            qrCode: res?.data.qr_code,
          },
        };
      }
      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create payment zalopay failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async createBeforeOrderATM(user: IUser, dto: BeforeOrderDto) {
    try {
      const embed_data = {
        preferred_payment_method: [],
        redirecturl: 'https://test-ecommerce-fe.vercel.app/cart',
        user: user,
        before_order_dto: dto,
      };
      //const items = dto.cartItems;
      const checkOrder = await this.orderService.checkoutOrder(
        user.id,
        dto.shopCart,
        dto.amount,
      );
      if (!checkOrder)
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: 'Amount not match',
        };
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: process.env.ZALO_APP_ID,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: `${dto.firstName} ${dto.lastName}` ?? user?.name,
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(
          checkOrder.newShopCart.map((ele) => ele.cartItems).flat(),
        ),
        embed_data: JSON.stringify(embed_data),
        amount: dto.amount,
        description: `Ecommerce - Payment for the order #${transID}`,
        bank_code: dto.bankCode,
        callback_url: `${process.env.BACKEND_HOST}/zalopay/callback-payment`,
        mac: '',
        phone: dto.phoneNumber,
        address: dto.address,
        email: user.email,
      };
      const data =
        order.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, process.env.ZALO_KEY1).toString();
      const res = await axios.post(
        `${process.env.ZALO_END_POINT}/create`,
        null,
        {
          params: order,
        },
      );

      if (res?.data?.return_code == 1) {
        return {
          type: 'Success',
          code: HttpStatus.OK,
          message: {
            amount: dto.amount,
            description: res?.data.description,
            codeTransition: order.app_trans_id,
            orderUrl: res?.data.order_url,
            qrCode: res?.data.qr_code,
          },
        };
      }
      return {
        type: 'Error',
        code: HttpStatus.BAD_REQUEST,
        message: 'Create payment zalopay failed',
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async callbackPayment(dto: CallbackDto) {
    try {
      const { data: dataStr, mac: reqMac } = dto;
      let mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALO_KEY2).toString();

      console.log('run callback');

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        return {
          type: 'Error',
          code: HttpStatus.BAD_REQUEST,
          message: {
            return_code: -1,
            return_message: 'mac not equal',
          },
        };
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let order = JSON.parse(dataStr) as IZALOPAY_ORDER;

        console.log(order);
        const embed_data: {
          user: IUser;
          before_order_dto: BeforeOrderDto;
        } = JSON.parse(order.embed_data);

        const newOrder = await this.orderService.createOrder(
          embed_data.user,
          embed_data.before_order_dto,
        );

        this.socketService.server.emit('payment-status', {
          type: 'Success',
          code: HttpStatus.OK,
          message: {
            return_code: 1,
            return_message: 'success',
            new_order: newOrder.message,
          },
        });
      }
    } catch (err) {
      this.socketService.server.emit('payment-status', {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: {
          return_code: -1,
          return_message: err?.message,
          new_order: null,
        },
      });
    }
  }

  async getStatusOrder(app_trans_id: string) {
    try {
      const postData = {
        app_id: process.env.ZALO_APP_ID,
        app_trans_id,
        mac: '',
      };
      let data =
        postData.app_id +
        '|' +
        postData.app_trans_id +
        '|' +
        process.env.ZALO_KEY1; // appid|app_trans_id|key1
      postData.mac = CryptoJS.HmacSHA256(
        data,
        process.env.ZALO_KEY1,
      ).toString();

      const res = await axios.post(
        `${process.env.ZALO_END_POINT}/query`,
        qs.stringify(postData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return res?.data;
      // return {
      //   type: 'Success',
      //   code: HttpStatus.OK,
      //   message: res?.data,
      // };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }

  async getBanks() {
    try {
      let reqtime = Date.now();
      const params = {
        appid: process.env.ZALO_APP_ID,
        reqtime: reqtime, // miliseconds
        mac: CryptoJS.HmacSHA256(
          process.env.ZALO_APP_ID + '|' + reqtime,
          process.env.ZALO_KEY1,
        ).toString(),
      };
      console.log(params);
      const { data } = await axios.get(
        'https://sbgateway.zalopay.vn/api/getlistmerchantbanks',
        {
          params,
        },
      );

      axios
        .get('https://sbgateway.zalopay.vn/api/getlistmerchantbanks', {
          params,
        })
        .then((res) => {
          let banks = res.data.banks;
          for (let id in banks) {
            let banklist = banks[id];
            console.log(id + '.');
            for (let bank of banklist) {
              console.log(bank);
            }
          }
        })
        .catch((err) => console.error(err));

      return data;
    } catch (err) {
      console.log(err);
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err.message,
      };
    }
  }
}
