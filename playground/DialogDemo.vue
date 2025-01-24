<template>
  <div class="min-h-screen h-200vh flex items-center justify-center bg-gray-50">
    <!-- Trigger Button -->
    <button
      @click="isDialogOpen = true"
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Open Dialog
    </button>

    <!-- Dialog Component -->
    <Dialog
      v-model="isDialogOpen"
      :aria-labelledby="dialogTitleId"
      :aria-describedby="dialogDescriptionId"
      @escape="handleEscape"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- Dialog Content -->
      <div class="fixed inset-0 bg-black bg-opacity-50">
        <div class="min-h-screen px-4 text-center">
          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="inline-block h-screen align-middle" aria-hidden="true"
            >&#8203;</span
          >

          <div
            class="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
          >
            <!-- Header -->
            <div class="flex justify-between items-center mb-4">
              <h3
                :id="dialogTitleId"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Payment Details
              </h3>
              <button
                @click="isDialogOpen = false"
                class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 rounded-full"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Description -->
            <p :id="dialogDescriptionId" class="text-sm text-gray-500 mb-4">
              Please enter your payment information to complete your purchase.
            </p>

            <!-- Form Content -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Card Number</label
                >
                <input
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234 1234 1234 1234"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Expiration Date</label
                  >
                  <input
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >CVC</label
                  >
                  <input
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="123"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  @click="isDialogOpen = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  @click="handlePayment"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "@/components";

// State
const isDialogOpen = ref(false);
const dialogTitleId = "payment-dialog-title";
const dialogDescriptionId = "payment-dialog-description";

// Event Handlers
const handleEscape = () => {
  console.log("Escape pressed");
  isDialogOpen.value = false;
};

const handleOpen = () => {
  console.log("Dialog opened");
};

const handleClose = () => {
  console.log("Dialog closed");
};

const handlePayment = () => {
  console.log("Processing payment...");
  isDialogOpen.value = false;
};
</script>
