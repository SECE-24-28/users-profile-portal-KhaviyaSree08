import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { prisma } from "@/lib/prisma";

const typeDefs = gql`
  type Student {
    id: Int
    name: String
    email: String
    department: String
    year: Int
    imageUrl: String
  }

  type Query {
    students: [Student]
  }

  type Mutation {
    addStudent(
      name: String!
      email: String!
      department: String!
      year: Int!
      imageUrl: String
    ): Student

    updateStudent(
      id: Int!
      name: String
      email: String
      department: String
      year: Int
      imageUrl: String
    ): Student


    deleteStudent(id: Int!): String
  }
`;

const resolvers = {
  Query: {
    students: async () => {
      return await prisma.student.findMany();
    },
  },

  Mutation: {
    addStudent: async (_: unknown, args: any) => {
      return await prisma.student.create({
        data: {
          name: args.name,
          email: args.email,
          department: args.department,
          year: args.year,
          imageUrl: args.imageUrl,
        },
      });
    },

    updateStudent: async (_: unknown, args: any) => {
        return await prisma.student.update({
        where: {
            id: args.id,
        },
        data: {
            name: args.name,
            email: args.email,
            department: args.department,
            year: args.year,
            imageUrl: args.imageUrl,
        },
        });
    },

    deleteStudent: async (_: unknown, args: { id: number }) => {
      await prisma.student.delete({
        where: {
          id: args.id,
        },
      });

      return "Student deleted successfully";
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };