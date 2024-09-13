import { UserSession } from "@/types"
import { User } from "@clerk/nextjs/server"
import { type ClassValue, clsx } from "clsx"
import { customAlphabet } from 'nanoid'
import { twMerge } from "tailwind-merge"
import prisma from "./prisma"

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')


export function format(date: Date, formatString: string) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  return formatString
    .replace('yyyy', year.toString())
    .replace('yy', String(year).slice(-2))
    .replace('LLL', monthNames[month])
    .replace('MM', String(month + 1).padStart(2, '0'))
    .replace('dd', String(day).padStart(2, '0'))
    .replace('d', day.toString())
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function parseISO(dateString: string) {
  return new Date(dateString)
}

export function subMonths(date: Date, amount: number) {
  const newDate: Date = new Date(date)
  newDate.setMonth(newDate.getMonth() - amount)
  return newDate
}

export const mapClerkUserForClient = (user: User): UserSession => {
  return {
    id: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
    fullName: user?.fullName!,
    imageUrl: user?.imageUrl
  };
};
export const runSimplePiplineAggregation = async ({
  pipeline,
  collectionName,
  batchSize = 100
}: {
  pipeline: any[];
  collectionName: string;
  batchSize?: number;
}) => {
  const results = await prisma.$runCommandRaw({
    aggregate: collectionName,
    pipeline,
    cursor: { batchSize }
  });

  if (typeof results === 'object' && results !== null && 'cursor' in results) {
    const cursor = results.cursor as { firstBatch?: unknown[] };
    return cursor.firstBatch || [];
  }

  return [];
};
