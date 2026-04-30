// app/actions.ts
"use server"

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTodos(userId: string) {
  return await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addTodo(userId: string, task: string) {
  if (!task.trim()) return { error: "Task cannot be empty" };
  
  try {
    await prisma.todo.create({
      data: { task, userId },
    });
    revalidatePath("/");
  } catch (e) {
    return { error: "Failed to add todo" };
  }
}

export async function toggleTodo(id: string, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed: !completed },
  });
  revalidatePath("/");
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({ where: { id } });
  revalidatePath("/");
}