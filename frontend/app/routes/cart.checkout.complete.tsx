import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { styles } from "~/common/styles";

export const action = async () => {
  return redirect("/");
};

export default function CheckoutComplete() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <div className="px-8 py-4 rounded-sm border border-black/80 h-fit flex-1 transition-all duration-300">
        <h2 className="font-bold text-3xl border-b border-black/80 pb-4 mb-2">
          Payment successful!
        </h2>
      </div>
      <Form
        action="/cart/checkout/complete"
        method="POST"
        className="px-8 pt-4 pb-6 rounded-sm max-h-[22rem] flex flex-col 
                      border border-black/80 transition-all duration-300"
      >
        <h2 className="font-bold text-3xl border-b border-black/80 pb-4">
          Leave a review
        </h2>
        <section className="flex flex-col gap-4 mt-4">
          <input type="text" className={styles.input} />
        </section>
        <div className="mt-auto pt-8">
          <div className="flex justify-between font-bold text-lg py-4 border-t border-black/80">
            <input type="text" />
          </div>
          <button
            className="font-medium text-lg w-full flex justify-center py-3 rounded-sm
            bg-primary text-white hover:bg-accent transition-colors duration-200"
          >
            Submit review
          </button>
        </div>
      </Form>
    </div>
  );
}
