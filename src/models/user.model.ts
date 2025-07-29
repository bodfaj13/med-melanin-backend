import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  surgeryDate?: Date;
  recoveryDay?: number;
  isActive?: boolean;
  preferences?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  calculateRecoveryDay(): number;
  getFullName(): string;
}

// Extend the model to include paginate method
export interface IUserModel extends mongoose.Model<IUser> {
  paginate(
    query: Record<string, unknown>,
    options: Record<string, unknown>
  ): Promise<{
    docs: IUser[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    offset: number;
  }>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [30, 'First name cannot exceed 30 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [30, 'Last name cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [4, 'Password must be at least 4 characters long'],
      select: false, // Don't include password in queries by default
    },
    surgeryDate: {
      type: Date,
      default: null,
    },
    recoveryDay: {
      type: Number,
      default: 0,
      min: [0, 'Recovery day cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 10 using synchronous method
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // If password is not loaded, we can't compare
  if (!this.password) {
    return false;
  }
  // Use synchronous compare method
  return bcrypt.compareSync(candidatePassword, this.password);
};

// Calculate recovery day based on surgery date
userSchema.methods.calculateRecoveryDay = function (): number {
  if (!this.surgeryDate) return 0;

  const today = new Date();
  const surgeryDate = new Date(this.surgeryDate);
  const diffTime = today.getTime() - surgeryDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

// Method to get full name
userSchema.methods.getFullName = function (): string {
  return `${this.firstName} ${this.lastName}`;
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
