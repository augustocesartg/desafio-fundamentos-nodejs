import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    this.validateTransaction({ title, value, type });

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }

  private validateTransaction({ value, type }: Request): void {
    if (type === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();

      if (value > total) {
        throw Error('Insufficient balance to make a transaction.');
      }
    }
  }
}

export default CreateTransactionService;
