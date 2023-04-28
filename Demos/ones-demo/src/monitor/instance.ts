import { startTransaction as sentryStartTransaction } from '@sentry/react';
import type { SpanStatusType } from '@sentry/tracing';
import type { Transaction, Span } from '@sentry/types';

const defaultIdleWaitTime = 1000;
const defaultMiniSpanCount = 200;

class RequestTransaction {
  private transaction: Transaction | null;

  private name: string; // transaction name

  private op: string; // root span operation

  private spans: Record<string, Span>;

  private count: number; // 当前 transaction 已上传 span 个数

  private timer: ReturnType<typeof setTimeout> | null;

  constructor(name: string, op: string) {
    this.transaction = null;
    this.spans = {};
    this.count = 0;
    this.name = name;
    this.op = op;
    this.timer = null;

    window.addEventListener('beforeunload', () => {
      // 检测浏览器关闭前是否还有未完成的 transaction，如果有则立即完成 transaction
      if (this.transaction && this.count) {
        this.finishTransaction();
      }
    });
  }

  public startTransaction() {
    const transaction = sentryStartTransaction({ name: this.name, op: this.op });
    this.transaction = transaction;
    this.count = 0;
    return transaction;
  }

  public getTransaction(): Transaction {
    if (!this.transaction) {
      const transaction = this.startTransaction();
      return transaction;
    }
    return this.transaction;
  }

  public finishTransaction(startNewTransaction: boolean = false) {
    if (!this.transaction) return;

    this.transaction.finish();
    this.transaction = null;

    if (startNewTransaction) {
      this.startTransaction();
    }
  }

  public finishAndStartNewTransaction() {
    this.finishTransaction(true);
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public startSpan(data: {
    name: string;
    data: {
      type: 'xhr' | 'fetch';
      method: string;
      url: string;
      [key: string]: any;
    };
  }): Span {
    this.clearTimer();
    const { name } = data;
    const { type, method, url, ...rest } = data.data;
    const transaction = this.getTransaction();
    const span = transaction.startChild({
      data: { ...rest, type, method, url, name },
      description: `${method} ${name}`,
      op: 'http.client',
    });

    this.spans[span.spanId] = span;
    return span;
  }

  public finishSpan(params: {
    spanId: string;
    data: {
      httpStatus?: number;
      spanStatus?: SpanStatusType;
    };
  }) {
    const { spanId } = params;
    const { httpStatus, spanStatus } = params.data;
    const span = this.spans[spanId];
    if (span) {
      if (httpStatus) {
        span.setHttpStatus(httpStatus);
      }
      if (spanStatus) {
        span.setStatus(spanStatus);
      }
      span.finish();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.spans[spanId];
      this.count += 1;
    } else {
      // eslint-disable-next-line no-console
      console.warn('Sentry warning: 未找到对应的span', spanId, this.spans); // 调试用，理论上不会进到这个打印
    }

    // 如果 defaultIdleWaitTime 内没有新的 span 则结束当前 transaction
    this.clearTimer();
    const isEmpty = !Object.keys(this.spans).length;
    if (isEmpty) {
      this.timer = setTimeout(() => {
        // 已上传 span 个数大于 defaultMiniSpanCount 时才结束当前 transaction
        if (this.count >= defaultMiniSpanCount) {
          this.finishTransaction();
        }
      }, defaultIdleWaitTime);
    }
  }
}

export const requestTransactionInstance = new RequestTransaction('request', 'request');

class NormalTransaction {
  private transaction: Transaction | null;

  private name: string; // transaction name

  private op: string; // root span operation

  private spans: Record<string, Span>;

  private count: number; // 当前 transaction 已上传 span 个数

  private timer: ReturnType<typeof setTimeout> | null;

  constructor(name: string, op: string) {
    this.transaction = null;
    this.spans = {};
    this.count = 0;
    this.name = name;
    this.op = op;
    this.timer = null;

    window.addEventListener('beforeunload', () => {
      // 检测浏览器关闭前是否还有未完成的 transaction，如果有则立即完成 transaction
      if (this.transaction && this.count) {
        this.finishTransaction();
      }
    });
  }

  public startTransaction() {
    const transaction = sentryStartTransaction({ name: this.name, op: this.op });
    this.transaction = transaction;
    this.count = 0;
    return transaction;
  }

  public getTransaction(): Transaction {
    if (!this.transaction) {
      const transaction = this.startTransaction();
      return transaction;
    }
    return this.transaction;
  }

  public finishTransaction(startNewTransaction: boolean = false) {
    if (!this.transaction) return;

    this.transaction.finish();
    this.transaction = null;

    if (startNewTransaction) {
      this.startTransaction();
    }
  }

  public finishAndStartNewTransaction() {
    this.finishTransaction(true);
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public startChild(params: {
    data: any,
    description: string,
    op: string,
  }) {
    return this.startSpan(params)
  }

  public startSpan(params: {
    data: any,
    description: string,
    op: string,
  }): Span {
    this.clearTimer();
    const { data, description, op } = params;
    const transaction = this.getTransaction();
    const span = transaction.startChild({ data, description, op });

    this.spans[span.spanId] = span;
    return span;
  }

  public finishSpan(params: {
    spanId: string;
  }) {
    const { spanId } = params;
    const span = this.spans[spanId];
    if (span) {
      span.finish();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.spans[spanId];
      this.count += 1;
    } else {
      // eslint-disable-next-line no-console
      console.warn('Sentry warning: 未找到对应的span', spanId, this.spans); // 调试用，理论上不会进到这个打印
    }

    // 如果 defaultIdleWaitTime 内没有新的 span 则结束当前 transaction
    this.clearTimer();
    const isEmpty = !Object.keys(this.spans).length;
    if (isEmpty) {
      this.timer = setTimeout(() => {
        // 已上传 span 个数大于 defaultMiniSpanCount 时才结束当前 transaction
        if (this.count >= defaultMiniSpanCount) {
          this.finishTransaction();
        }
      }, defaultIdleWaitTime);
    }
  }
}

export const generateTransactionInstance = (name: string, op: string) => {
  return new NormalTransaction(name, op);
}