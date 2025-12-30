<script lang="ts">
  import type { RemoteFormIssue } from "@sveltejs/kit";
  import { login, register } from "./auth.remote";

  const { username, password } = login.fields;

  let issues = $state<RemoteFormIssue | undefined>();
  $effect(() => {
    issues = login.fields.allIssues()?.at(0);
  });
  $effect(() => {
    issues = register.fields.allIssues()?.at(0);
  });
</script>

<h1>Login/Register</h1>
<form {...login}>
  <label data-component="field">
    Username
    <input {...username.as("text")} />
  </label>
  <label data-component="field">
    Password
    <input {...password.as("password")} />
  </label>
  <div data-component="errors">
    {#if issues}
      <p>{issues.message}</p>
    {/if}
  </div>
  <div data-component="button-group">
    <button data-component="button">Login</button>
    <button data-component="button" {...register.buttonProps}>Register</button>
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
  }

  [data-component="errors"] {
    display: none;
    flex-direction: column;
    gap: 0.5rem;

    & p {
      margin: 0;
      color: var(--destructive);
    }

    &:has(p) {
      display: flex;
    }
  }
</style>
