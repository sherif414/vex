<template>
  <div class="space-y-8 p-8 bg-gray-50">
    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Glass-morphic Alerts</h3>
      <!-- Glass Success Alert -->
      <Alert
        class="bg-white/40 backdrop-blur-md border border-green-200/50 rounded-xl shadow-lg p-4"
      >
        <AlertHeader
          as="h2"
          class="text-green-800 font-semibold flex items-center gap-3"
        >
          <div
            class="bg-green-500/10 p-2.5 rounded-lg ring-1 ring-green-500/20"
          >
            <SuccessIcon class="h-6 w-6 text-green-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">Deployment Successful</span>
            <span class="text-sm font-normal text-green-600"
              >v2.1.0 - Production</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-[3.25rem]">
          <p class="mb-2">Successfully deployed to production servers:</p>
          <ul class="list-disc list-inside space-y-1 text-sm pl-1">
            <li>
              <span class="text-gray-500">us-east-1:</span>
              <span class="text-green-600">✓</span> Completed in 45s
            </li>
            <li>
              <span class="text-gray-500">eu-west-2:</span>
              <span class="text-green-600">✓</span> Completed in 38s
            </li>
            <li>
              <span class="text-gray-500">ap-south-1:</span>
              <span class="text-green-600">✓</span> Completed in 42s
            </li>
          </ul>
        </AlertContent>
      </Alert>

      <!-- Glass Error Alert -->
      <Alert
        class="bg-white/40 backdrop-blur-md border border-red-200/50 rounded-xl shadow-lg p-4"
      >
        <AlertHeader
          as="h2"
          class="text-red-800 font-semibold flex items-center gap-3"
        >
          <div class="bg-red-500/10 p-2.5 rounded-lg ring-1 ring-red-500/20">
            <ErrorIcon class="h-6 w-6 text-red-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">CI/CD Pipeline Failed</span>
            <span class="text-sm font-normal text-red-600"
              >Build #1247 - Feature Branch</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-[3.25rem]">
          <p class="mb-2">
            Pipeline failed at test stage with following errors:
          </p>
          <div class="bg-red-50/50 rounded-lg p-3 text-sm font-mono">
            <p class="text-red-700">
              Error: Test failed: src/components/auth/__tests__/login.test.ts
            </p>
            <p class="text-red-600/70 text-xs mt-1">
              Expected value to be true, received false at line 127
            </p>
          </div>
        </AlertContent>
      </Alert>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Modern Gradient Alerts</h3>
      <!-- Modern Warning Alert -->
      <Alert
        class="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-200 rounded-xl shadow-md p-4"
      >
        <AlertHeader
          as="h2"
          class="text-yellow-800 font-semibold flex items-center gap-3"
        >
          <div class="bg-yellow-500 rounded-full p-2">
            <WarningIcon class="h-6 w-6 text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">Database Migration Required</span>
            <span class="text-sm font-normal text-yellow-700"
              >Scheduled for 15 Aug 2023, 03:00 UTC</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-yellow-700 mt-3 pl-[3.75rem]">
          <p class="mb-2">Critical database migration pending:</p>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Estimated downtime: 45 minutes</li>
            <li>Affects: User Authentication, Payment Processing</li>
            <li>Backup will be created automatically</li>
          </ul>
        </AlertContent>
      </Alert>

      <!-- Modern Info Alert -->
      <Alert
        class="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-blue-200 rounded-xl shadow-md p-4"
      >
        <AlertHeader
          as="h2"
          class="text-blue-800 font-semibold flex items-center gap-3"
        >
          <div class="bg-blue-500 rounded-full p-2">
            <InfoIcon class="h-6 w-6 text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">New API Version Available</span>
            <span class="text-sm font-normal text-blue-700"
              >v3.2.0 Release Notes</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-blue-700 mt-3 pl-[3.75rem]">
          <p class="mb-2">Key improvements in this release:</p>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Enhanced rate limiting with custom rules</li>
            <li>New endpoints for batch processing</li>
            <li>Improved error handling and validation</li>
            <li>
              <span class="text-blue-900 font-medium">Breaking change:</span>
              Authentication header format updated
            </li>
          </ul>
        </AlertContent>
      </Alert>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Elegant Bordered Alerts</h3>
      <!-- Elegant Success Alert -->
      <Alert
        class="bg-white border-l-4 border border-green-500 rounded-r-lg shadow-md p-4"
      >
        <AlertHeader
          as="h2"
          class="text-green-800 font-semibold flex items-center gap-3"
        >
          <SuccessIcon class="h-6 w-6 text-green-500" />
          <div class="flex flex-col">
            <span class="text-lg">Payment Processed Successfully</span>
            <span class="text-sm font-normal text-green-600"
              >Transaction ID: #8A12B9C3</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-9">
          <div class="flex justify-between items-center mb-2 text-sm">
            <span>Amount Paid:</span>
            <span class="font-medium text-gray-900">$2,499.00</span>
          </div>
          <div class="flex justify-between items-center mb-2 text-sm">
            <span>Payment Method:</span>
            <span class="text-gray-900">•••• •••• •••• 4242</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span>Date:</span>
            <span class="text-gray-900">Aug 14, 2023 09:45 AM UTC</span>
          </div>
        </AlertContent>
      </Alert>

      <!-- Elegant Error Alert -->
      <Alert
        class="bg-white border-l-4 border border-red-500 rounded-r-lg shadow-md p-4"
      >
        <AlertHeader
          as="h2"
          class="text-red-800 font-semibold flex items-center gap-3"
        >
          <ErrorIcon class="h-6 w-6 text-red-500" />
          <div class="flex flex-col">
            <span class="text-lg">Payment Authorization Failed</span>
            <span class="text-sm font-normal text-red-600"
              >Error Code: INSF_FUNDS</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-9">
          <div class="flex justify-between items-center mb-2 text-sm">
            <span>Attempted Amount:</span>
            <span class="font-medium text-gray-900">$899.00</span>
          </div>
          <div class="flex justify-between items-center mb-2 text-sm">
            <span>Card Number:</span>
            <span class="text-gray-900">•••• •••• •••• 5678</span>
          </div>
          <div class="mt-3 text-sm text-red-600">
            Please verify your card has sufficient funds or try a different
            payment method.
          </div>
        </AlertContent>
      </Alert>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-medium text-gray-900">Minimalist Alerts</h3>
      <!-- Minimalist Warning Alert -->
      <Alert class="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
        <AlertHeader
          as="h2"
          class="text-gray-900 font-semibold flex items-center gap-3"
        >
          <div class="bg-yellow-100 rounded-lg p-2.5">
            <WarningIcon class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">Storage Space Critical</span>
            <span class="text-sm font-normal text-yellow-600"
              >2.1 GB remaining of 25 GB</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-[3.75rem]">
          <div class="space-y-2">
            <p>Largest space usage:</p>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between">
                <span>Media Files</span>
                <span class="text-yellow-600">12.8 GB</span>
              </div>
              <div class="flex justify-between">
                <span>Documents</span>
                <span class="text-yellow-600">6.2 GB</span>
              </div>
              <div class="flex justify-between">
                <span>Application Data</span>
                <span class="text-yellow-600">3.9 GB</span>
              </div>
            </div>
          </div>
        </AlertContent>
      </Alert>

      <!-- Minimalist Info Alert -->
      <Alert class="bg-white rounded-lg shadow-lg border border-gray-100 p-4">
        <AlertHeader
          as="h2"
          class="text-gray-900 font-semibold flex items-center gap-3"
        >
          <div class="bg-blue-100 rounded-lg p-2.5">
            <InfoIcon class="h-6 w-6 text-blue-600" />
          </div>
          <div class="flex flex-col">
            <span class="text-lg">System Maintenance</span>
            <span class="text-sm font-normal text-blue-600"
              >Sunday, Aug 20, 2023</span
            >
          </div>
        </AlertHeader>
        <AlertContent as="div" class="text-gray-600 mt-3 pl-[3.75rem]">
          <div class="space-y-2">
            <p class="text-sm">Scheduled maintenance details:</p>
            <div class="bg-blue-50/50 rounded-lg p-3 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-700">Start Time:</span>
                <span class="text-blue-700">02:00 AM GMT</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Duration:</span>
                <span class="text-blue-700">~2 hours</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700">Services Affected:</span>
                <span class="text-blue-700">API, Dashboard</span>
              </div>
            </div>
          </div>
        </AlertContent>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { Alert, AlertContent, AlertHeader } from "@/components";
import { h } from "vue";

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clip-rule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clip-rule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clip-rule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clip-rule="evenodd"
    />
  </svg>
);
</script>
