package com.example.firebase_20190925;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class MainActivity extends AppCompatActivity {

    private final String TAG ="MainActivity";

    EditText et_userEmail, et_userPW;
    Button btn_signUp, btn_signIn;
    private FirebaseAuth mAuth;

    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mAuth = FirebaseAuth.getInstance();
        sharedPreferences = getSharedPreferences("session", MODE_PRIVATE);

        et_userEmail = findViewById(R.id.et_email);
        et_userPW = findViewById(R.id.et_pw);
        btn_signUp = findViewById(R.id.btn_signup);
        btn_signIn = findViewById(R.id.btn_signin);

        btn_signUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(MainActivity.this,SignUpActivity.class);
                startActivity(intent);
            }
        });
//        // 회원가입 버튼 클릭
//        btn_signUp.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                String userEmail = et_userEmail.getText().toString();
//                String userPW = et_userPW.getText().toString();
//
//                mAuth.createUserWithEmailAndPassword(userEmail, userPW)
//                        .addOnCompleteListener(MainActivity.this, new OnCompleteListener<AuthResult>() {
//                            @Override
//                            public void onComplete(@NonNull Task<AuthResult> task) {
//                                if (task.isSuccessful()) {
//                                    // Sign in success, update UI with the signed-in user's information
//                                    Log.d(TAG, "createUserWithEmail: success");
//                                    Toast.makeText(MainActivity.this, "회원가입 성공. 로그인 해주세요!", Toast.LENGTH_SHORT).show();
//                                    FirebaseUser user = mAuth.getCurrentUser();
//                                    successSignUp(user);
//                                } else {
//                                    // If sign in fails, display a message to the user.
//                                    Log.w(TAG, "createUserWithEmail:failure", task.getException());
//                                    Toast.makeText(MainActivity.this, "회원가입 실패",
//                                            Toast.LENGTH_SHORT).show();
//                                }
//
//                            }
//                        });
//            }
//        });

        // 로그인 버튼 클릭
        btn_signIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userEmail = et_userEmail.getText().toString();
                String userPW = et_userPW.getText().toString();

                mAuth.signInWithEmailAndPassword(userEmail, userPW)
                        .addOnCompleteListener(MainActivity.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    // Sign in success, update UI with the signed-in user's information
                                    Log.d(TAG, "signInWithEmail:success");
                                    FirebaseUser user = mAuth.getCurrentUser();
                                    successSignIn(user);
                                } else {
                                    // If sign in fails, display a message to the user.
                                    Log.w(TAG, "signInWithEmail:failure", task.getException());
                                    Toast.makeText(MainActivity.this, "로그인 실패",
                                            Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
            }
        });

    }
//여기서 부터 shared preference자나
    @Override
    public void onStart() {
        super.onStart();
        // Check if user is signed in (non-null) and update UI accordingly.
//        FirebaseUser currentUser = mAuth.getCurrentUser();
//        if(!currentUser.equals(null))
//            successSignIn(currentUser);

        String userEmail = sharedPreferences.getString("userEmail", "");
        if(!userEmail.equals("")){
            FirebaseUser currentUser = mAuth.getCurrentUser();
            successSignIn(currentUser);
        }
    }


    // user 정보 db에 넣기
    public void successSignUp(FirebaseUser user){
        et_userEmail.setText("");
        et_userPW.setText("");
    }

    public void successSignIn(FirebaseUser user){
        et_userEmail.setText("");
        et_userPW.setText("");

        String userEmail = user.getEmail();

        // session에 필요한 값들 저장
        SharedPreferences.Editor sessionEditor = sharedPreferences.edit();
        sessionEditor.putString("userEmail", userEmail);
        // ...
        sessionEditor.apply();

        Toast.makeText(this, userEmail + "님, 환영합니다.", Toast.LENGTH_SHORT).show();

        Intent intent = new Intent(MainActivity.this, testServerActivity.class);
        startActivity(intent);
        finish();
    }

}
