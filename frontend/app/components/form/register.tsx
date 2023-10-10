import { Form } from "@remix-run/react";
import { styles } from "~/common/styles";

export function RegisterUserForm() {
  return (
    <Form action="/register" method="POST" className="flex flex-col gap-8">
      <input
        type="text"
        className={styles.input}
        name="firstName"
        placeholder="Jane"
      />
      <input
        type="text"
        className={styles.input}
        name="lastName"
        placeholder="Doe"
      />
      <input
        type="email"
        className={styles.input}
        name="email"
        placeholder="janedoe@gmail.com"
      />
      <input
        type="password"
        className={styles.input}
        name="password"
        placeholder="Password..."
      />
      <div className="flex justify-center text-white/80 text-lg">
        <button type="submit" className={styles.submitButtonLarge}>
          Register User
        </button>
      </div>
    </Form>
  );
}

export function RegisterBusinessForm() {
  return (
    <Form action="/register" method="POST" className="flex flex-col gap-8">
      <input
        type="text"
        className={styles.input}
        name="firstName"
        placeholder="Jane"
      />
      <input
        type="text"
        className={styles.input}
        name="lastName"
        placeholder="Doe"
      />
      <input
        type="email"
        className={styles.input}
        name="email"
        placeholder="janedoe@gmail.com"
      />
      <input
        type="password"
        className={styles.input}
        name="password"
        placeholder="Password..."
      />
      <div className="flex justify-center text-white/80 text-lg">
        <button type="submit" className={styles.submitButtonLarge}>
          Register Business
        </button>
      </div>
    </Form>
  );
}
